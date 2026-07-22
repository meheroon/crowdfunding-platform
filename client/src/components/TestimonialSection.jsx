"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Film Maker",
    quote:
      "FundSpark helped me raise funds for my documentary project. The community support was overwhelming and truly made my dream a reality.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "Tech Entrepreneur",
    quote:
      "As a first-time creator, I was nervous about launching my campaign. FundSpark made the process seamless and the supporters were incredibly generous.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Artist & Designer",
    quote:
      "The platform is beautifully designed and easy to use. I was able to fund my art installation within two weeks of launching my campaign.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    role: "Social Entrepreneur",
    quote:
      "FundSpark connected me with supporters who believed in my mission to bring clean water to rural communities. Forever grateful.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Lisa Thompson",
    role: "Music Producer",
    quote:
      "I funded my entire album through FundSpark. The credit system is brilliant and makes supporting projects so much easier.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from creators and supporters who have made their mark on
            FundSpark
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
                  />
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-primary-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
