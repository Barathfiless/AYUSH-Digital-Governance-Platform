import { motion } from 'framer-motion';

const ministers = [
    {
        name: 'Shri Narendra Modi',
        title: 'Hon\'ble Prime Minister of India',
        image: '/narendra_modi.png',
        fallback: 'PM'
    },
    {
        name: 'Shri Prataprao Jadhav',
        title: 'Hon\'ble Minister of State (Independent Charge), Ministry of Ayush and Minister of State, Ministry of Health and Family Welfare',
        image: '/prataprao_jadhav.png',
        fallback: 'MOS'
    }
];

export function MinistersSection() {
    return (
        <section className="py-16 bg-[#f0f4f8]">
            <div className="container-wide">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 max-w-7xl mx-auto px-4">
                    {ministers.map((minister, index) => (
                        <motion.div
                            key={minister.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex items-center justify-center sm:justify-start group relative"
                        >
                            {/* Large Circle Background */}
                            <div className="shrink-0 relative z-10 w-48 h-48 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                                {minister.image ? (
                                    <img
                                        src={minister.image}
                                        alt={minister.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-3xl">${minister.fallback}</div>`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-3xl">
                                        {minister.fallback}
                                    </div>
                                )}
                            </div>

                            {/* Text Content Card */}
                            <div className="flex-1 bg-white rounded-r-3xl rounded-l-md p-8 pl-12 -ml-10 min-h-[160px] flex flex-col justify-center shadow-md relative z-0 border border-white/50">
                                <h3 className="text-[#002b5b] font-bold text-xl md:text-2xl mb-2 leading-tight">
                                    {minister.name}
                                </h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                                    {minister.title}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
