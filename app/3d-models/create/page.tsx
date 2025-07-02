import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createModel } from '@/app/lib/models';
import type { Model } from '@/app/types';

// Server Action to handle form submission
async function handleCreateModel(formData: FormData) {
  'use server';

  // Extract form data
  const name = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as string;

  // Validate required fields
  if (!name || !category) {
    throw new Error('Title and category are required');
  }

  try {
    // Insert the new model into the database
    const modelData: Omit<Model, 'id'> = {
      name,
      category,
      description: description || '',
      image: image || '',
      likes: 0,
      dateAdded: new Date().toISOString(),
    };

    await createModel(modelData);

    // TODO: Add a success message

    // Redirect to the models page
    redirect('/3d-models');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default async function NewModelPage() {
  // Categories from the models data
  const categories = [
    'toys-games',
    'household',
    'props-cosplay',
    'education',
    'art',
    'tools',
    'miniatures',
    'fashion',
    '3d-printer',
    'hobby-diy',
  ];

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          href="/3d-models"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to All Models
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Model</h1>
        <p className="text-gray-600 text-lg">
          Share your 3D model with the community
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form action={handleCreateModel} className="space-y-6 -mt-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Model Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-3 text-base border border-[#606060] rounded-lg focus:border-[#606060] focus:outline-none focus:ring-0 transition-colors"
              placeholder="Enter model title..."
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-3 text-base border border-[#606060] rounded-lg focus:border-[#606060] focus:outline-none focus:ring-0 transition-colors"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL Field */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Image URL
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Enter a direct link to an image of your model
            </p>
            <input
              type="url"
              id="image"
              name="image"
              className="w-full px-4 py-3 text-base border border-[#606060] rounded-lg focus:border-[#606060] focus:outline-none focus:ring-0 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-3 text-base border border-[#606060] rounded-lg focus:border-[#606060] focus:outline-none focus:ring-0 transition-colors resize-none"
              placeholder="Describe your model..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Upload Model
            </button>
            <Link
              href="/3d-models"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
