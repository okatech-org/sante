-- Server-side input validation via triggers to address client-side-only validation
-- Create or replace validation functions and triggers for key tables

-- Profiles validation function and trigger
CREATE OR REPLACE FUNCTION public.validate_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Normalize phone (remove spaces)
  IF NEW.phone IS NOT NULL THEN
    NEW.phone := REPLACE(NEW.phone, ' ', '');
  END IF;

  -- Email format
  IF NEW.email IS NOT NULL AND NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Phone format (Gabon +241, allow empty string)
  IF NEW.phone IS NOT NULL AND NEW.phone <> '' AND NEW.phone !~ '^\+241\d{8,10}$' THEN
    RAISE EXCEPTION 'Invalid phone format. Expected +241XXXXXXXX or +241XXXXXXXXXX';
  END IF;

  -- Full name length
  IF NEW.full_name IS NULL OR length(btrim(NEW.full_name)) < 2 OR length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Full name must be between 2 and 100 characters';
  END IF;

  -- Neighborhood length
  IF NEW.neighborhood IS NOT NULL AND length(NEW.neighborhood) > 100 THEN
    RAISE EXCEPTION 'Neighborhood too long (max 100)';
  END IF;

  -- Height and weight ranges
  IF NEW.height_m IS NOT NULL AND (NEW.height_m <= 0 OR NEW.height_m >= 3) THEN
    RAISE EXCEPTION 'Height must be between 0 and 3 meters';
  END IF;
  IF NEW.weight_kg IS NOT NULL AND (NEW.weight_kg <= 0 OR NEW.weight_kg >= 500) THEN
    RAISE EXCEPTION 'Weight must be between 0 and 500 kg';
  END IF;

  -- Blood group validation
  IF NEW.blood_group IS NOT NULL AND NEW.blood_group NOT IN ('A+','A-','B+','B-','AB+','AB-','O+','O-') THEN
    RAISE EXCEPTION 'Invalid blood group value';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_validate_biu ON public.profiles;
CREATE TRIGGER profiles_validate_biu
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profiles();

-- Medical history validation
CREATE OR REPLACE FUNCTION public.validate_medical_history()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.condition_name IS NULL OR length(btrim(NEW.condition_name)) < 2 OR length(NEW.condition_name) > 200 THEN
    RAISE EXCEPTION 'Condition name must be between 2 and 200 characters';
  END IF;

  IF NEW.status NOT IN ('active','resolved','chronic','monitoring') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;

  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 2000 THEN
    RAISE EXCEPTION 'Notes too long (max 2000)';
  END IF;

  IF NEW.diagnosed_date IS NOT NULL AND NEW.diagnosed_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Diagnosed date cannot be in the future';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS medical_history_validate_biu ON public.medical_history;
CREATE TRIGGER medical_history_validate_biu
BEFORE INSERT OR UPDATE ON public.medical_history
FOR EACH ROW EXECUTE FUNCTION public.validate_medical_history();

-- Consultations validation
CREATE OR REPLACE FUNCTION public.validate_consultations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.reason IS NULL OR length(btrim(NEW.reason)) < 5 OR length(NEW.reason) > 1000 THEN
    RAISE EXCEPTION 'Reason must be between 5 and 1000 characters';
  END IF;

  IF NEW.doctor_name IS NULL OR length(btrim(NEW.doctor_name)) < 2 OR length(NEW.doctor_name) > 100 THEN
    RAISE EXCEPTION 'Doctor name must be between 2 and 100 characters';
  END IF;

  IF NEW.consultation_type NOT IN ('video','in-person','phone','emergency') THEN
    RAISE EXCEPTION 'Invalid consultation type';
  END IF;

  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 5000 THEN
    RAISE EXCEPTION 'Notes too long (max 5000)';
  END IF;

  IF NEW.diagnosis IS NOT NULL AND length(NEW.diagnosis) > 5000 THEN
    RAISE EXCEPTION 'Diagnosis too long (max 5000)';
  END IF;

  -- Allow reasonable future scheduling (<= 1 year)
  IF NEW.consultation_date IS NULL OR NEW.consultation_date > (CURRENT_DATE + INTERVAL '1 year') THEN
    RAISE EXCEPTION 'Consultation date must be within the next year';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS consultations_validate_biu ON public.consultations;
CREATE TRIGGER consultations_validate_biu
BEFORE INSERT OR UPDATE ON public.consultations
FOR EACH ROW EXECUTE FUNCTION public.validate_consultations();

-- Treatments validation
CREATE OR REPLACE FUNCTION public.validate_treatments()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.medication_name IS NULL OR length(btrim(NEW.medication_name)) < 2 OR length(NEW.medication_name) > 200 THEN
    RAISE EXCEPTION 'Medication name must be between 2 and 200 characters';
  END IF;

  IF NEW.dosage IS NULL OR length(btrim(NEW.dosage)) < 2 OR length(NEW.dosage) > 100 THEN
    RAISE EXCEPTION 'Dosage must be between 2 and 100 characters';
  END IF;

  IF NEW.frequency IS NULL OR length(btrim(NEW.frequency)) < 2 OR length(NEW.frequency) > 100 THEN
    RAISE EXCEPTION 'Frequency must be between 2 and 100 characters';
  END IF;

  IF NEW.status NOT IN ('active','completed','discontinued','paused') THEN
    RAISE EXCEPTION 'Invalid treatment status';
  END IF;

  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 2000 THEN
    RAISE EXCEPTION 'Notes too long (max 2000)';
  END IF;

  IF NEW.end_date IS NOT NULL AND NEW.end_date < NEW.start_date THEN
    RAISE EXCEPTION 'End date cannot be before start date';
  END IF;

  IF NEW.start_date < DATE '2000-01-01' OR NEW.start_date > (CURRENT_DATE + INTERVAL '1 month') THEN
    RAISE EXCEPTION 'Start date must be reasonable';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS treatments_validate_biu ON public.treatments;
CREATE TRIGGER treatments_validate_biu
BEFORE INSERT OR UPDATE ON public.treatments
FOR EACH ROW EXECUTE FUNCTION public.validate_treatments();

-- Pharmacies validation
CREATE OR REPLACE FUNCTION public.validate_pharmacies()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.name IS NULL OR length(btrim(NEW.name)) < 2 OR length(NEW.name) > 200 THEN
    RAISE EXCEPTION 'Pharmacy name must be between 2 and 200 characters';
  END IF;

  IF NEW.address IS NULL OR length(btrim(NEW.address)) < 5 OR length(NEW.address) > 300 THEN
    RAISE EXCEPTION 'Address must be between 5 and 300 characters';
  END IF;

  IF NEW.city IS NULL OR length(btrim(NEW.city)) < 2 OR length(NEW.city) > 100 THEN
    RAISE EXCEPTION 'City must be between 2 and 100 characters';
  END IF;

  IF NEW.province IS NULL OR length(btrim(NEW.province)) < 2 OR length(NEW.province) > 100 THEN
    RAISE EXCEPTION 'Province must be between 2 and 100 characters';
  END IF;

  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?\d{6,}$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;

  IF NEW.email IS NOT NULL AND NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF (NEW.latitude IS NULL) != (NEW.longitude IS NULL) THEN
    RAISE EXCEPTION 'Latitude and longitude must both be null or both present';
  END IF;

  IF NEW.latitude IS NOT NULL THEN
    IF NEW.latitude < -90 OR NEW.latitude > 90 OR NEW.longitude < -180 OR NEW.longitude > 180 THEN
      RAISE EXCEPTION 'Invalid coordinates';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pharmacies_validate_biu ON public.pharmacies;
CREATE TRIGGER pharmacies_validate_biu
BEFORE INSERT OR UPDATE ON public.pharmacies
FOR EACH ROW EXECUTE FUNCTION public.validate_pharmacies();

-- Prescription pharmacy requests validation
CREATE OR REPLACE FUNCTION public.validate_prescription_requests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending','confirmed','ready','completed','cancelled') THEN
    RAISE EXCEPTION 'Invalid request status';
  END IF;

  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 1000 THEN
    RAISE EXCEPTION 'Notes too long (max 1000)';
  END IF;

  IF NEW.prescription_id IS NULL OR length(btrim(NEW.prescription_id)) < 5 THEN
    RAISE EXCEPTION 'Prescription id too short';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prescription_requests_validate_biu ON public.prescription_pharmacy_requests;
CREATE TRIGGER prescription_requests_validate_biu
BEFORE INSERT OR UPDATE ON public.prescription_pharmacy_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_prescription_requests();

-- Profile change requests validation
CREATE OR REPLACE FUNCTION public.validate_profile_change_requests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pending','approved','rejected') THEN
    RAISE EXCEPTION 'Invalid change request status';
  END IF;

  IF NEW.change_type NOT IN ('personal_info','medical_info','contact_info','insurance_info') THEN
    RAISE EXCEPTION 'Invalid change type';
  END IF;

  IF NEW.status = 'rejected' AND NEW.rejection_reason IS NULL THEN
    RAISE EXCEPTION 'Rejection reason required when status is rejected';
  END IF;

  IF NEW.status <> 'pending' AND (NEW.reviewed_by IS NULL OR NEW.reviewed_at IS NULL) THEN
    RAISE EXCEPTION 'Reviewed by/at required when approving or rejecting';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_change_requests_validate_biu ON public.profile_change_requests;
CREATE TRIGGER profile_change_requests_validate_biu
BEFORE INSERT OR UPDATE ON public.profile_change_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_profile_change_requests();
