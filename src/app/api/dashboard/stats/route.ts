import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      productCount,
      categoryCount,
      enquiryCount,
      userCount,
      metalRateCount,
      testimonialCount,
      serviceCount,
      blogPostCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.contactEnquiry.count(),
      prisma.user.count(),
      prisma.metalRate.count(),
      prisma.testimonial.count(),
      prisma.service.count(),
      prisma.blogPost.count(),
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

    return NextResponse.json({
      success: true,
      data: {
        totalDataCount,
        breakdown: {
          products: productCount,
          categories: categoryCount,
          enquiries: enquiryCount,
          users: userCount,
          metalRates: metalRateCount,
          testimonials: testimonialCount,
          services: serviceCount,
          blogPosts: blogPostCount,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
