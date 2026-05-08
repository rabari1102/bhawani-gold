export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // A very simple markdown to HTML converter for display purposes
  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/^### (.*$)/gim, '<h3 className="text-2xl font-heading font-bold mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 className="text-3xl font-heading font-bold mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 className="text-4xl font-heading font-bold mt-12 mb-6">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\> (.*$)/gim, '<blockquote className="border-l-4 border-[#B8860B] pl-4 italic text-gray-600 my-6 bg-gray-50 py-2">$1</blockquote>')
      .replace(/\n\n/g, '</p><p className="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/g, '<br />');
    
    // Quick fix for lists
    html = html.replace(/<br \/>- (.*?)(?=<br \/>|$)/g, '<li>$1</li>');
    html = html.replace(/<br \/>\d+\. (.*?)(?=<br \/>|$)/g, '<li>$1</li>');
    
    return `<p className="mb-4 text-gray-700 leading-relaxed">${html}</p>`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-[#FFF8F0]">
        <div className="container-custom max-w-4xl text-center">
          <div className="text-sm text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#B8860B]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#B8860B]">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-[#B8860B]">Article</span>
          </div>
          
          <div className="text-sm text-[#B8860B] font-semibold tracking-wider mb-4 uppercase">
            {new Date(post.publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {post.coverImage && (
        <div className="container-custom max-w-5xl -mt-8 relative z-10">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <article className="section-padding">
        <div className="container-custom max-w-3xl">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[#B8860B] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
          
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
             <Link href="/blog" className="text-[#B8860B] font-semibold flex items-center gap-2 hover:text-black transition-colors">
               <span>←</span> Back to all articles
             </Link>
             <div className="flex gap-4">
               <span className="text-sm text-gray-500 font-medium">Share:</span>
               {['FB', 'TW', 'WA'].map(s => (
                 <button key={s} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 hover:bg-[#B8860B] hover:text-white transition-colors">
                   {s}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
