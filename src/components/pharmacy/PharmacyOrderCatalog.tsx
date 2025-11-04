import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useMedicationsSearch } from "@/hooks/useMedicationsSearch";
import { toast } from "sonner";

interface PharmacyOrderCatalogProps {
  open: boolean;
  onClose: () => void;
  pharmacyId: string;
  pharmacyName: string;
}

interface CartItem {
  id: string;
  nom: string;
  dosage?: string;
  prix: number;
  quantite: number;
}

export function PharmacyOrderCatalog({ open, onClose, pharmacyId, pharmacyName }: PharmacyOrderCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: suggestions } = useMedicationsSearch(searchQuery, 10);
  const results = Array.isArray(suggestions) ? suggestions : [];
  const productsWithoutPrescription = results.filter((m: any) => !m.necessite_ordonnance);

  const addToCart = (med: any) => {
    const existing = cart.find((c) => c.id === med.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === med.id ? { ...c, quantite: c.quantite + 1 } : c)));
    } else {
      setCart([
        ...cart,
        {
          id: med.id,
          nom: med.dci || med.nom_commercial || "",
          dosage: med.dosage,
          prix: med.prix_moyen_pharmacie || 0,
          quantite: 1,
        },
      ]);
    }
    toast.success("Ajouté au panier");
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((c) => (c.id === id ? { ...c, quantite: Math.max(1, c.quantite + delta) } : c))
        .filter((c) => c.quantite > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const total = cart.reduce((sum, c) => sum + c.prix * c.quantite, 0);

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    toast.success("Commande envoyée à la pharmacie", {
      description: `Total: ${total.toLocaleString()} FCFA`,
    });
    setCart([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Catalogue {pharmacyName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Produits de parapharmacie et médicaments sans ordonnance
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
          <div className="md:col-span-2 space-y-4 overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit (paracétamol, vitamines, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              {productsWithoutPrescription.length === 0 && searchQuery.length >= 2 && (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun produit sans ordonnance trouvé</p>
              )}
              {productsWithoutPrescription.map((med: any) => (
                <Card key={med.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{med.dci || med.nom_commercial}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {med.dosage && <span>{med.dosage}</span>}
                          {med.forme_pharmaceutique && <span>• {med.forme_pharmaceutique}</span>}
                        </div>
                        <p className="text-sm font-semibold mt-1">
                          {med.prix_moyen_pharmacie ? `${med.prix_moyen_pharmacie.toLocaleString()} FCFA` : "Prix: NC"}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => addToCart(med)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-l pl-4 flex flex-col">
            <h3 className="font-semibold mb-3">Panier ({cart.length})</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Panier vide</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.nom}</p>
                        {item.dosage && <p className="text-xs text-muted-foreground">{item.dosage}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantite}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold">{(item.prix * item.quantite).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{total.toLocaleString()} FCFA</span>
              </div>
              <Button className="w-full" onClick={handleSubmitOrder} disabled={cart.length === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Commander ({cart.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

