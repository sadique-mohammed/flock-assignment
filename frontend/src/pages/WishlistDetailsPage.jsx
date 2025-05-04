import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistById,
  addProductToWishlist,
  removeProductFromWishlist,
  updateProductInWishlist,
  inviteUsersToWishlist,
  selectCurrentWishlist,
  selectWishlistLoading,
  selectWishlistError,
} from "../store/wishlistSlice";
import { selectIsAuthenticated } from "../store/authSlice";
import { showToast } from "../lib/toast";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Trash,
  PlusCircle,
  ArrowLeft,
  ExternalLink,
  Share2,
  Loader2,
  AlertTriangle,
  User,
  Edit,
} from "lucide-react";

const WishlistDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    _id: "",
    name: "",
    price: "",
    imageUrl: "",
  });

  const wishlist = useSelector(selectCurrentWishlist);
  const loading = useSelector(selectWishlistLoading);
  const errorMessage = useSelector(selectWishlistError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchWishlistById(id))
      .unwrap()
      .catch(() => {
        showToast.error("Failed to fetch wishlist details");
      });
  }, [dispatch, id, isAuthenticated, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price) || 0,
      imageUrl: newProduct.imageUrl || null,
    };

    try {
      await dispatch(addProductToWishlist({ wishlistId: id, product: productData })).unwrap();
      showToast.success("Product added successfully!");
      setNewProduct({ name: "", price: "", imageUrl: "" });
      setIsAddProductOpen(false);
    } catch (error) {
      console.error(error);
      showToast.error("Failed to add product");
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        await dispatch(removeProductFromWishlist({ wishlistId: id, productId })).unwrap();
        showToast.success("Product removed successfully");
      } catch (error) {
        console.error(error);
        showToast.error("Failed to remove product");
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
    });
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const productData = {
      name: editingProduct.name,
      price: parseFloat(editingProduct.price) || 0,
      imageUrl: editingProduct.imageUrl || null,
    };

    try {
      await dispatch(
        updateProductInWishlist({
          wishlistId: id,
          productId: editingProduct._id,
          productData,
        })
      ).unwrap();

      showToast.success("Product updated successfully!");
      setIsEditProductOpen(false);
    } catch (error) {
      console.error(error);
      showToast.error("Failed to update product");
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await dispatch(
        inviteUsersToWishlist({
          wishlistId: id,
          emails: [inviteEmail],
        })
      ).unwrap();
      showToast.success("Invitation sent successfully!");
      setInviteEmail("");
      setIsInviteOpen(false);
    } catch (error) {
      console.error(error);
      showToast.error("Failed to send invitation");
    }
  };

  const handleShareWishlist = () => {
    const shareUrl = `${window.location.origin}/shared/${id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast.success("Wishlist link copied to clipboard!");
  };

  if (loading && !wishlist) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading wishlist...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/wishlists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wishlists
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Wishlist Not Found</h2>
        <p className="mb-4">The wishlist you're looking for does not exist or has been deleted.</p>
        <Button variant="outline" asChild>
          <Link to="/wishlists">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wishlists
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/wishlists">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wishlists
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{wishlist.name}</h1>
            {wishlist.description && <p className="text-gray-500 mt-1">{wishlist.description}</p>}
          </div>

          <div className="flex gap-2">
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleInviteUser}>
                  <DialogHeader>
                    <DialogTitle>Invite to Wishlist</DialogTitle>
                    <DialogDescription>
                      Invite someone to collaborate on "{wishlist.name}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="example@email.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleShareWishlist}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddProduct}>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Add a new product to your wishlist.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name *</Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Wireless Headphones"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price *</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 99.99"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-image">Image URL (Optional)</Label>
                      <Input
                        id="product-image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddProductOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
              <DialogContent>
                <form onSubmit={handleUpdateProduct}>
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update product details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-product-name">Product Name *</Label>
                      <Input
                        id="edit-product-name"
                        placeholder="e.g., Wireless Headphones"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-product-price">Price *</Label>
                      <Input
                        id="edit-product-price"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 99.99"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-product-image">Image URL (Optional)</Label>
                      <Input
                        id="edit-product-image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={editingProduct.imageUrl}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditProductOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {wishlist.products && wishlist.products.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50 max-w-md mx-auto flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <PlusCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6 max-w-xs">
            Add your first product to start building your wishlist. You can add items from any
            website!
          </p>
          <Button onClick={() => setIsAddProductOpen(true)} size="lg" className="animate-pulse">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Products you add will appear here. Later, you can share this wishlist with others.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products &&
            wishlist.products.map((product) => (
              <Card key={product._id}>
                <CardHeader className="relative pb-0">
                  {product.imageUrl ? (
                    <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square w-full rounded-t-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
                  {product.addedBy && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span>Added by: {product.addedBy.name || product.addedBy.email}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  {product.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
        </div>
      )}

      {loading && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistDetailsPage;
