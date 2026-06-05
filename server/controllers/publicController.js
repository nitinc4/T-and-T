import Company from '../models/Company.js';

export const getActiveCompanies = async (req, res) => {
  try {
    // Only return minimal data needed for Client Selection
    const companies = await Company.find({ isActive: true })
      .select('name _id')
      .sort({ name: 1 });
    
    // In a real app we might also return a 'logoUrl' if added to the schema
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCompanyConfig = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findOne({ _id: id, isActive: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found or inactive' });
    }

    // Fetch from the database
    let sduiConfig = company.appConfig;

    // Fallback default if not configured yet
    if (!sduiConfig || !sduiConfig.theme) {
      sduiConfig = {
        theme: {
          primaryColor: "#FF385C", // Airbnb red
          secondaryColor: "#00A699"
        },
        layout: [
          {
            type: "hero_banner",
            data: {
              imageUrl: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2069&auto=format&fit=crop",
              title: `Welcome to ${company.name}`,
              subtitle: "Find your next adventure.",
              actionText: "Explore Now"
            }
          },
          {
            type: "grid_categories",
            data: {
              title: "Top Destinations",
              items: [
                { label: "Beaches", icon: "beach_access" },
                { label: "Mountains", icon: "terrain" },
                { label: "Cities", icon: "location_city" },
                { label: "Camping", icon: "park" }
              ]
            }
          },
          {
            type: "horizontal_list",
            data: {
              title: "Popular Packages",
              items: [
                { title: "Bali Getaway", price: "₹25,000", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=60" },
                { title: "Swiss Alps", price: "₹85,000", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=500&q=60" }
              ]
            }
          }
        ]
      };
    }

    res.json(sduiConfig);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
