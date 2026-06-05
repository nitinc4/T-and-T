import 'package:flutter/material.dart';

class SDUIEngine {
  static Widget buildWidget(Map<String, dynamic> json, Color primaryColor) {
    final type = json['type'];
    final data = json['data'];

    switch (type) {
      case 'hero_banner':
        return _buildHeroBanner(data, primaryColor);
      case 'grid_categories':
        return _buildGridCategories(data, primaryColor);
      case 'horizontal_list':
        return _buildHorizontalList(data, primaryColor);
      default:
        return const SizedBox.shrink();
    }
  }

  static Widget _buildHeroBanner(Map<String, dynamic> data, Color primaryColor) {
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

  static Widget _buildGridCategories(Map<String, dynamic> data, Color primaryColor) {
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

  static Widget _buildHorizontalList(Map<String, dynamic> data, Color primaryColor) {
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
                return Container(
                  width: 160,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    image: DecorationImage(
                      image: NetworkImage(item['image']),
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
                          item['title'],
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          item['price'],
                          style: TextStyle(color: primaryColor, fontWeight: FontWeight.w800),
                        ),
                      ],
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
}
