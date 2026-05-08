export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [
    productCount,
    categoryCount,
    enquiryCount,
    userCount,
    metalRateCount,
    testimonialCount,
    serviceCount,
    blogPostCount,
    recentEnquiries
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.contactEnquiry.count(),
    prisma.user.count(),
    prisma.metalRate.count(),
    prisma.testimonial.count(),
    prisma.service.count(),
    prisma.blogPost.count(),
    prisma.contactEnquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  ]);

  const totalDataCount =
    productCount +
    categoryCount +
    enquiryCount +
    userCount +
    metalRateCount +
    testimonialCount +
    serviceCount +
    blogPostCount;

  const stats = [
    { label: 'Total Data', value: totalDataCount, icon: '📊', link: '#' },
    { label: 'Products', value: productCount, icon: '💎', link: '/admin/products' },
    { label: 'Categories', value: categoryCount, icon: '📁', link: '/admin/categories' },
    { label: 'Enquiries', value: enquiryCount, icon: '✉️', link: '/admin/enquiries' },
    { label: 'Metal Rates', value: metalRateCount, icon: '📈', link: '/admin/metal-rates' },
    { label: 'Testimonials', value: testimonialCount, icon: '⭐', link: '/admin/testimonials' },
    { label: 'Services', value: serviceCount, icon: '🛠️', link: '/admin/services' },
    { label: 'Blog Posts', value: blogPostCount, icon: '📝', link: '/admin/blog' },
    { label: 'Users', value: userCount, icon: '👥', link: '#' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              {stat.link !== '#' ? (
                <Link href={stat.link} className="text-xs text-[#B8860B] hover:underline mt-2 inline-block">Manage →</Link>
              ) : (
                <span className="text-xs text-gray-400 mt-2 inline-block">No Manage Page</span>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center text-2xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Enquiries</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentEnquiries.length > 0 ? (
            recentEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{enquiry.name} <span className="text-sm font-normal text-gray-500 ml-2">{enquiry.email}</span></h4>
                  <span className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                </div>
                {enquiry.interestedIn && (
                  <span className="inline-block px-2 py-1 bg-[#FFF8F0] text-[#B8860B] text-xs font-medium rounded mb-3">
                    Interested in: {enquiry.interestedIn}
                  </span>
                )}
                <p className="text-sm text-gray-700 bg-white p-3 border border-gray-100 rounded mt-1">"{enquiry.message}"</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No recent enquiries found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
