import { Link } from 'react-router-dom'
import watch from '../utils/watch.svg'
import jewellary from '../utils/jewellary.svg'
import leatherWork from '../utils/leatherWork.svg'
function About() {
    return (
        <div >
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 bg-cover bg-center" style={{ backgroundImage: `url(https://cdn6.f-cdn.com/contestentries/977833/23488134/58d58d670cb50_thumb900.jpg)` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Our Story
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-text/80">
                        Refinding time with quality and elegance.
                    </p>
                    <Link to="/products" className="btn-primary inline-block">
                        Shop Now
                    </Link>
                </div>
            </section>
            <section className="py-16 ">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <h1 className="text-4xl md:text-2xl font-bold mb-6 text-center">
                                Our Story
                            </h1>
                            <img src="https://ae01.alicdn.com/kf/Hffc29d6e5ad345d1bbdcb576e20a34a5G.jpg" alt="About Us" className="w-full h-96 object-cover rounded" />
                        </div>
                        <div className="overflow-hidden lg:col-span-1">
                            <div className=" p-6 sticky pb-0">
                                <h3 className="font-semibold text-2xl mb-2 text-accent">
                                    Beyond the Dial
                                </h3>
                                <p className="text-text/70 text-md mb-4 ">
                                    At Aura Horology, we see a watch as a symphony of gears and a statement of character. Founded in 2024, our journey began with a simple passion: to bring world-class precision and timeless aesthetics to your wrist. Today, we curate more than just timepieces; we offer handcrafted jewelry and premium leather goods that complete the look of a true connoisseur. Every piece in our collection is a tribute to elegance and engineering.
                                </p>
                            </div>
                            <div className=" p-6 sticky ">
                                <h3 className="font-semibold text-2xl mb-2 text-accent">
                                    Beyond the Dial
                                </h3>
                                <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                                    <div className='card lg:col-span-1 p-4 text-center'>

                                        <img src={watch} alt="Watch" className="w-32 h-32 object-cover rounded m-auto" />
                                        <h3 className="font-semibold text-lg mb-2 text-black">
                                            Precision Engineering
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            We source watches with high-quality movements and sapphire glass, ensuring your timepiece lasts for generations
                                        </p>
                                    </div>
                                    <div className='card lg:col-span-1 p-4 text-center'>

                                        <img src={jewellary} alt="Watch" className="w-32 h-32 object-cover rounded m-auto" />
                                        <h3 className="font-semibold text-lg mb-2 text-black">
                                            Elegant Accents
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Our jewelry collection is designed to perfectly complement your watch, adding a touch of luxury to your everyday style.
                                        </p>
                                    </div>
                                    <div className='card lg:col-span-1 p-4 text-center'>

                                        <img src={leatherWork} alt="Watch" className="w-32 h-32 object-cover rounded m-auto" />
                                        <h3 className="font-semibold text-lg mb-2 text-black">
                                            Handcrafted Finish
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            From premium leather straps to artisan wallets, we use only the finest materials for a sophisticated feel.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>

    )
}

export default About
