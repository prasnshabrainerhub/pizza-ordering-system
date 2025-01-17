import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import {Navigation} from "swiper";
import { Header } from '../components/Header';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      <Header />

      {/* Hero Section with Background */}
      <section className="relative h-[80vh]"> {/* Reduced from 110vh to 80vh */}
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
          <Image
            src="/Homemain.png"
            alt="Delicious Pizza"
            fill
            style={{ 
              objectFit: "cover", 
              filter: "blur(3px)"
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-6">
              {t('Welcome to Pizza Bliss')}
            </h1>
            <p className="text-xl mb-8">
              {t('Satisfy your cravings with the finest pizza in town! Fresh ingredients, fast delivery, and unbeatable taste.')}
            </p>
            <Link href="/dashboard">
              <button className="bg-red-500 text-white px-8 py-4 text-lg font-bold rounded hover:bg-red-600 transition-colors uppercase">
                {t('Lets Eat')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-8">
          {/* Left Side: Pizza Image */}
          <div className="w-full md:w-1/3">
            <Image 
              src="/Homepageimage1.png"
              alt="Pizza"
              className="w-full rounded-lg shadow-lg"
              width={400}
              height={400}
            />
          </div>

          {/* Right Side: Content */}
          <div className="w-full md:w-2/3 bg-white p-8">
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-1 bg-red-500 mr-2"></div>
                <p className="text-red-500 text-sm font-medium">{t('since 2021')}</p>
              </div>

              <h3 className="text-5xl font-extrabold text-gray-800 tracking-tight font-serif">
                {t('Pizza So Good, Even')}
              </h3>
              <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight font-serif">
                {t('Your Diet Will Cheat!')}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed pt-6">
                {t('Each slice is an adventure, featuring a golden crust that is both crispy and soft, layered with vibrant fresh toppings and rich sauces. Whether you crave classic flavors or bold new combinations, each bite is a flavorful rebellion against boring meals. Experience the best pizza at La Milano Pizzeria. Where every pizza is crafted to perfection. With our pizza order online option.')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Offer Slider Section */}
      <div className="px-4 py-16 bg-gray-90">
        {/* Offer Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-500 tracking-tight">{t('OFFERS YOU CANOT RESIST')}</h2>
        </div>

        <Swiper
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Navigation]} // Add Navigation module
          navigation
        >
          {/* Add each offer image here */}
          <SwiperSlide>
            <Image src="/OfferImage1.png" alt="Buy 1 Get 1 Free" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage2.png" alt="50% Off" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage3.png" alt="Free Drink with Pizza" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage5.png" alt="Free Dessert on Orders Over $30" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage1.png" alt="Buy 1 Get 1 Free" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide> 
            <Image src="/OfferImage2.png" alt="50% Off" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage3.png" alt="Free Drink with Pizza" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
          <SwiperSlide>
            <Image src="/OfferImage5.png" alt="Free Dessert on Orders Over $30" className="w-3/4 h-auto mx-auto rounded-lg shadow-lg" width={400} height={400}/>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="bg-white text-black"> {/* Parent div with white background and black text */}
      {/* Heading for Pizza Boxes */}
      <div className="text-center my-8">
        <h2 className="text-4xl font-extrabold text-gray-800 font-serif">
          {t('Sourced Fresh, Made to Wow')}
        </h2>
      </div>

      {/* Offer Boxes Below the Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-8">
        {/* Box 1 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza1.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('Buy 1 Get 1 Free Pizza')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Sourced Fresh, Made to Wow. Enjoy our signature pizzas at a great price!')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>

        {/* Box 2 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza4.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('LA MILANO PANEER')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Green Capsicum, Crunchy Onion, Spiced Paneer, Golden Corn, Black Olive in Cheese Sauce.')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>

        {/* Box 3 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza3.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('Bogo Pizza Near Me')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Dig in with our amazing pizza deals.')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>

        {/* Box 4 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza4.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('Authentic Pesto Pasta')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Green Capsicum, Crunchy Onion, Golden Corn, Black Olives with Authentic Pesto Sauce.')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>

        {/* Box 5 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza1.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('Crispy Garlic Bread')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Freshly baked bread with garlic butter, a perfect companion to your pizza.')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>

        {/* Box 6 */}
        <div className="relative border-2 border-gray-300 rounded-lg p-6 hover:bg-red-600 hover:text-white transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Image
              src="/pizza3.png" // Small pizza image for the box
              alt="Pizza"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 text-gray-800">{t('Lemon Herb Wings')}</h4>
          <p className="text-sm text-center mb-4 text-gray-600">
            {t('Crispy chicken wings with a tangy lemon herb sauce.')}
          </p>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-4">
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full">{t('Buy Now')}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="bg-red-500 text-white py-6 z-10 relative">
        <div className="container mx-auto text-center">
          <p className="text-lg mb-4">
            {t('Contact us:')} 123-456-7890 | support@pizzabliss.com
          </p>
          <p className="text-sm">&copy; {t('2025 Pizza Bliss. All rights reserved.')}</p>
        </div>
      </footer>
    </div>
  );
};

export const getServerSideProps = async ({ locale }) => {
  if (!locale) {
    locale = ['en', 'es', 'hi'];
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default Home;
