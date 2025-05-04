import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchWishlists,
  createWishlist,
  deleteWishlist,
  selectAllWishlists,
  selectWishlistLoading,
  selectWishlistError,
} from "../store/wishlistSlice";
import { selectIsAuthenticated, selectAuthToken } from "../store/authSlice";
import { showToast } from "../lib/toast";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Trash, PlusCircle, Share2, Edit, Loader2, AlertTriangle } from "lucide-react";

const WishlistsPage = () => {
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlists = useSelector(selectAllWishlists);
  const loading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  if (!token) console.log("Token:", token);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchWishlists())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch wishlists:", error);
        showToast.error("Failed to fetch wishlists");
      });
  }, [dispatch, isAuthenticated, navigate]);

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    try {
      await dispatch(
        createWishlist({
          name: newWishlistName,
          description: newWishlistDescription,
        })
      ).unwrap();

      showToast.success("Wishlist created successfully!");
      setNewWishlistName("");
      setNewWishlistDescription("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create wishlist:", error);
      showToast.error("Failed to create wishlist");
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    if (window.confirm("Are you sure you want to delete this wishlist?")) {
      try {
        await dispatch(deleteWishlist(wishlistId)).unwrap();
        showToast.success("Wishlist deleted successfully");
      } catch (error) {
        console.error("Failed to delete wishlist:", error);
        showToast.error("Failed to delete wishlist");
      }
    }
  };

  const handleShareWishlist = (wishlistId) => {
    const shareUrl = `${window.location.origin}/shared/${wishlistId}`;
    navigator.clipboard.writeText(shareUrl);
    showToast.success("Wishlist link copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Wishlists</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Wishlist</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateWishlist}>
              <DialogHeader>
                <DialogTitle>Create New Wishlist</DialogTitle>
                <DialogDescription>
                  Add a new wishlist to organize your desired items.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="wishlist-name">Wishlist Name</Label>
                  <Input
                    id="wishlist-name"
                    placeholder="e.g., Birthday Wishlist"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wishlist-description">Description (Optional)</Label>
                  <Input
                    id="wishlist-description"
                    placeholder="e.g., Things I'd like for my birthday"
                    value={newWishlistDescription}
                    onChange={(e) => setNewWishlistDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Wishlist"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && !wishlists.length ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading wishlists...</span>
        </div>
      ) : wishlists.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-3">No wishlists yet</h2>
          <p className="text-gray-500 mb-6">Create your first wishlist to start adding items!</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Your First Wishlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist) => (
            <Card key={wishlist._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="font-bold text-xl">{wishlist.name}</CardTitle>
                {wishlist.description && <CardDescription>{wishlist.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{wishlist.products?.length || 0} items</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 bg-gray-50 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteWishlist(wishlist._id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareWishlist(wishlist._id)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/wishlists/${wishlist._id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {loading && wishlists.length > 0 && (
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

export default WishlistsPage;
