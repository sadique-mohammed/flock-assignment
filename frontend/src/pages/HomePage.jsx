import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/authSlice";
import { Button } from "../components/ui/button";

const HomePage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-16 lg:py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Create and Share Your <span className="text-primary">Wishlists</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Organize your desired items in one place and share them with friends and family. The
          easiest way to keep track of what you want and share it with others.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button asChild size="lg">
              <Link to="/wishlists">View My Wishlists</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="py-12 grid md:grid-cols-3 gap-8 md:gap-12">
        <FeatureCard
          title="Create Wishlists"
          description="Create multiple wishlists for different occasions like birthdays, holidays, or just for yourself."
          icon="🎁"
        />
        <FeatureCard
          title="Add Products"
          description="Add any product from any website to your wishlists with name, price, and image."
          icon="🛍️"
        />
        <FeatureCard
          title="Share with Friends"
          description="Share your wishlists with friends and family so they know exactly what you want."
          icon="🔗"
        />
      </section>

      <section className="py-12 md:py-16 bg-gray-50 rounded-lg my-8">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create an Account"
              description="Sign up for a free account to get started with wishlists."
            />
            <StepCard
              number="2"
              title="Create Wishlists"
              description="Create and customize wishlists for any occasion."
            />
            <StepCard
              number="3"
              title="Share with Others"
              description="Share your wishlists with a simple link."
            />
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of people using our platform to organize their wishlists and share with
          loved ones.
        </p>
        {!isAuthenticated && (
          <Button asChild size="lg">
            <Link to="/signup">Create Free Account</Link>
          </Button>
        )}
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all duration-200">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

export default HomePage;
