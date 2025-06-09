import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getPage(slug: string): Promise<PageData | null> {
  try {
    // Call the admin panel's public API directly
    const API_BASE_URL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'  // Local admin panel (updated port)
      : (process.env.NEXT_PUBLIC_API_URL || 'https://mispri24.vercel.app/api'); // Production admin panel

    console.log('Fetching page from admin panel:', `${API_BASE_URL}/public/pages/${slug}`);

    const response = await fetch(`${API_BASE_URL}/public/pages/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch page:', response.status, response.statusText);
      return null;
    }

    const page = await response.json();
    console.log('Successfully fetched page:', page.title);
    return page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${page.title} | Mispri`,
    description: page.content.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function StaticPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page || !page.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          <div className="h-1 w-20 bg-blue-600 rounded"></div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 border">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
