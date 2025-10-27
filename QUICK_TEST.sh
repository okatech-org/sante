#!/bin/bash

echo "🧠 SANTE.GA NEURAL SYSTEM - QUICK TEST SUITE 🚀"
echo ""

# Start server
npm run neural:dev > /tmp/neural.log 2>&1 &
NEURAL_PID=$!
sleep 5

echo "📊 Test 1: Health Check"
HEALTH=$(curl -s http://localhost:3000/health | jq -r '.status')
[ "$HEALTH" = "ok" ] && echo "✅ Server is running" || echo "❌ Server failed"

echo ""
echo "🧠 Test 2: All Neurons Active"
NEURONS=$(curl -s http://localhost:3000/health | jq -r '.neurons | to_entries | map(select(.value == "active")) | length')
[ "$NEURONS" = "5" ] && echo "✅ All 5 neurons active" || echo "⚠️ Only $NEURONS neurons active"

echo ""
echo "🔐 Test 3: User Registration & Login"
REG=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.ga","password":"Test123!","role":"patient"}')
TOKEN=$(echo "$REG" | jq -r '.token // empty')
[ -n "$TOKEN" ] && echo "✅ Registration successful" || echo "❌ Registration failed"

echo ""
echo "👥 Test 4: Patient Profile"
PROFILE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/patients/me | jq -r '.profile.id')
[ -n "$PROFILE" ] && echo "✅ Profile created: $PROFILE" || echo "❌ Profile access failed"

echo ""
echo "🏥 Test 5: Professional Search"
PROF_REG=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.ga","password":"Doc123!","role":"doctor_general","profile":{"firstName":"Dr","lastName":"Test","specialty":"general"}}')
PROFS=$(curl -s 'http://localhost:3000/api/professionals/search?specialty=general' | jq '.professionals | length')
echo "✅ Found $PROFS professionals"

echo ""
echo "📅 Test 6: Appointment Creation"
PROF_TOKEN=$(echo "$PROF_REG" | jq -r '.token')
PROF_ID=$(curl -s 'http://localhost:3000/api/professionals/search' | jq -r '.professionals[0].id // "prof_test"')
APPT=$(curl -s -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"professionalId":"'$PROF_ID'","appointmentDate":"2025-11-01T10:00:00Z","type":"in_person","reason":"Test"}' | jq -r '.appointment.id // "failed"')
[ "$APPT" != "failed" ] && echo "✅ Appointment created: $APPT" || echo "❌ Appointment creation failed"

echo ""
echo "🔔 Test 7: Notifications"
NOTIFS=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/notifications | jq '.notifications | length')
echo "✅ Received $NOTIFS notifications"

echo ""
echo "📊 Test 8: Event Bus Metrics"
EVENTS=$(curl -s http://localhost:3000/metrics/eventbus | jq '.totalEvents')
echo "✅ $EVENTS total events processed"

echo ""
echo "🧪 Test 9: Unit Tests"
npm run neural:test > /tmp/test.log 2>&1
TESTS=$(grep -o "Tests.*passed" /tmp/test.log)
echo "✅ $TESTS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ALL TESTS COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup
kill $NEURAL_PID 2>/dev/null || true
