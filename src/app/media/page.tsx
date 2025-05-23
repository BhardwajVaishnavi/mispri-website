import Image from 'next/image';
import Link from 'next/link';

// Mock media data
const mediaItems = [
  {
    id: 1,
    title: 'Mispri Launches New Seasonal Collection',
    date: 'June 15, 2023',
    source: 'Business Standard',
    excerpt: 'Mispri, the leading bakery and gift shop in Bhubaneswar, has launched its new seasonal collection featuring innovative cake designs and flower arrangements.',
    image: '/images/media/media1.jpg',
    link: '#'
  },
  {
    id: 2,
    title: 'Mispri Wins "Best Bakery" Award for the Third Consecutive Year',
    date: 'April 22, 2023',
    source: 'Food & Hospitality Today',
    excerpt: 'Mispri has been recognized as the "Best Bakery" in Bhubaneswar for the third consecutive year at the annual Food Excellence Awards.',
    image: '/images/media/media2.jpg',
    link: '#'
  },
  {
    id: 3,
    title: 'Mispri Expands Operations to New Locations',
    date: 'March 10, 2023',
    source: 'Odisha Business Review',
    excerpt: 'Following its success in Bhubaneswar, Mispri has announced plans to expand its operations to three new locations across Odisha.',
    image: '/images/media/media3.jpg',
    link: '#'
  },
  {
    id: 4,
    title: 'Mispri Partners with Local Farmers for Sustainable Sourcing',
    date: 'February 5, 2023',
    source: 'Sustainable Business Network',
    excerpt: 'In a move towards sustainability, Mispri has partnered with local farmers to source fresh, organic ingredients for their bakery products.',
    image: '/images/media/media4.jpg',
    link: '#'
  },
  {
    id: 5,
    title: "Mispri's Innovative Cake Designs Featured in National Magazine",
    date: 'December 12, 2022',
    source: 'Baking Industry Magazine',
    excerpt: "Mispri's innovative cake designs and techniques have been featured in a special spread in the national Baking Industry Magazine.",
    image: '/images/media/media5.jpg',
    link: '#'
  },
  {
    id: 6,
    title: 'Mispri Hosts Annual Cake Festival',
    date: 'November 8, 2022',
    source: 'Odisha Times',
    excerpt: 'Mispri hosted its annual Cake Festival, showcasing a variety of cake designs and offering workshops for cake enthusiasts.',
    image: '/images/media/media6.jpg',
    link: '#'
  }
];

// Press releases
const pressReleases = [
  {
    id: 1,
    title: 'Mispri Announces Eco-Friendly Packaging Initiative',
    date: 'May 20, 2023',
    excerpt: 'Mispri today announced its transition to 100% eco-friendly packaging for all products, reinforcing its commitment to environmental sustainability.'
  },
  {
    id: 2,
    title: 'Mispri Introduces New Vegan Product Line',
    date: 'April 5, 2023',
    excerpt: 'Responding to growing customer demand, Mispri has launched a new line of vegan cakes and pastries made with plant-based ingredients.'
  },
  {
    id: 3,
    title: 'Mispri Celebrates 5th Anniversary with Community Event',
    date: 'March 1, 2023',
    excerpt: 'Mispri celebrated its 5th anniversary with a community event featuring cake tastings, flower arranging workshops, and special promotions.'
  }
];

export default function MediaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Media Coverage</h1>

        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover the latest news, articles, and press releases featuring Mispri. We're proud to share our journey and achievements with you.
        </p>

        {/* Media Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {item.source}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <a
                  href={item.link}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Press Releases */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <div key={release.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{release.title}</h3>
                  <span className="text-sm text-gray-500">{release.date}</span>
                </div>
                <p className="text-gray-600 mb-3">{release.excerpt}</p>
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Media Inquiries */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Media Inquiries</h2>
          <p className="text-gray-600 mb-6">
            For media inquiries, interview requests, or additional information about Mispri, please contact our media relations team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <p className="text-gray-600 mb-1">Email: media@mispri.com</p>
              <p className="text-gray-600 mb-1">Phone: +91 9876543210</p>
              <p className="text-gray-600">Hours: Monday to Friday, 9 AM - 5 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Media Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Download Press Kit
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Brand Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    High-Resolution Logos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Product Images
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
