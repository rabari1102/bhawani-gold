import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishDate: 'desc' }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom text-center">
          <span className="text-[#B8860B] font-semibold tracking-widest uppercase text-sm mb-4 block">Knowledge Hub</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Our Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover expert tips, jewellery trends, and styling guides from the artisans at Bhawani Jewellers.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] relative bg-[#f5ede0] overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 img-placeholder group-hover:scale-105 transition-transform duration-500"></div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-[#B8860B] font-semibold tracking-wider mb-3">
                    {new Date(post.publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#B8860B] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-gray-900 flex items-center gap-2 group-hover:text-[#B8860B] transition-colors">
                      Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
