import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SDUIEngine {
  static Widget buildWidget(BuildContext context, Map<String, dynamic> json, Color primaryColor) {
    final type = json['type'];
    final data = json['data'];

    switch (type) {
      case 'hero_banner':
        return _buildHeroBanner(context, data, primaryColor);
      case 'grid_categories':
        return _buildGridCategories(context, data, primaryColor);
      case 'horizontal_list':
        return _buildHorizontalList(context, data, primaryColor);
      case 'image_carousel':
        return _buildImageCarousel(context, data, primaryColor);
      case 'testimonials':
        return _buildTestimonials(context, data, primaryColor);
      case 'call_to_action':
        return _buildCallToAction(context, data, primaryColor);
      default:
        return const SizedBox.shrink();
    }
  }

  static Widget _buildHeroBanner(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    return Container(
      margin: const EdgeInsets.all(16.0),
      height: 220,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        image: DecorationImage(
          image: NetworkImage(data['imageUrl']),
          fit: BoxFit.cover,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Gradient Overlay
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data['title'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  data['subtitle'],
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  decoration: BoxDecoration(
                    color: primaryColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    data['actionText'],
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static Widget _buildGridCategories(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    final items = List<Map<String, dynamic>>.from(data['items']);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            data['title'],
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: items.map((item) {
              return Column(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      _getIcon(item['icon']),
                      color: primaryColor,
                      size: 28,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item['label'],
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  static Widget _buildHorizontalList(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    final items = List<Map<String, dynamic>>.from(data['items']);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              data['title'],
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (context, index) => const SizedBox(width: 16),
              itemBuilder: (context, index) {
                final item = items[index];
                return GestureDetector(
                  onTap: () {
                    context.push('/package-details', extra: item);
                  },
                  child: Container(
                    width: 160,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      image: DecorationImage(
                        image: NetworkImage(item['image'] ?? 'https://via.placeholder.com/400'),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Colors.transparent, Colors.black.withOpacity(0.6)],
                        ),
                      ),
                      padding: const EdgeInsets.all(12.0),
                      alignment: Alignment.bottomLeft,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item['title'] ?? 'Title',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            item['price'] ?? '',
                            style: TextStyle(color: primaryColor, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  static IconData _getIcon(String name) {
    switch (name) {
      case 'beach_access': return Icons.beach_access;
      case 'terrain': return Icons.terrain;
      case 'location_city': return Icons.location_city;
      case 'park': return Icons.park;
      default: return Icons.star;
    }
  }

  static Widget _buildImageCarousel(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    final images = List<String>.from(data['images'] ?? []);
    if (images.isEmpty) return const SizedBox.shrink();

    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(vertical: 16.0),
      child: PageView.builder(
        controller: PageController(viewportFraction: 0.85),
        itemCount: images.length,
        itemBuilder: (context, index) {
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 8.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              image: DecorationImage(
                image: NetworkImage(images[index]),
                fit: BoxFit.cover,
              ),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 5)),
              ],
            ),
          );
        },
      ),
    );
  }

  static Widget _buildTestimonials(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    final reviews = List<Map<String, dynamic>>.from(data['reviews'] ?? []);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              data['title'] ?? 'Reviews',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 140,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              scrollDirection: Axis.horizontal,
              itemCount: reviews.length,
              separatorBuilder: (context, index) => const SizedBox(width: 16),
              itemBuilder: (context, index) {
                final review = reviews[index];
                return Container(
                  width: 250,
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: List.generate(
                          review['rating'] ?? 5,
                          (i) => const Icon(Icons.star, color: Colors.amber, size: 16),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: Text(
                          '"${review['text']}"',
                          style: const TextStyle(fontStyle: FontStyle.italic, color: Colors.black87),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '- ${review['name']}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  static Widget _buildCallToAction(BuildContext context, Map<String, dynamic> data, Color primaryColor) {
    return Container(
      margin: const EdgeInsets.all(16.0),
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: primaryColor.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        children: [
          Text(
            data['title'] ?? 'Ready to explore?',
            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            data['subtitle'] ?? 'Join us today and start your journey.',
            style: const TextStyle(color: Colors.white70, fontSize: 14),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: primaryColor,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(
              data['buttonText'] ?? 'Get Started',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}
