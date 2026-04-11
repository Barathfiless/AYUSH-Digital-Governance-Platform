import { motion } from 'framer-motion';

const logos = [
    { name: 'Ministry of Ayush', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Ministry_of_AYUSH.svg' },
    { name: 'GOI Web Directory', url: 'https://flagcdn.com/in.svg' },
    { name: 'Digital India', url: 'https://upload.wikimedia.org/wikipedia/en/9/95/Digital_India_logo.svg' },
    { name: 'GatiShakti', url: 'https://upload.wikimedia.org/wikipedia/en/5/52/PM_Gati_Shakti_Logo.png' },
    { name: 'MyGov', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/MyGov_Logo.png' },
    { name: 'Data.gov.in', url: 'https://data.gov.in/sites/default/files/data_government_in_logo.png' },
    { name: 'India.gov.in', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/India.gov.in_logo.png' }
];

export function ImportantLinksSection() {
    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="container-wide">
                <h2 className="text-center text-[#002b5b] font-bold text-2xl mb-10 tracking-tight">Our Important Links</h2>

                <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-14 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="h-10 lg:h-12 w-auto flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                        >
                            <img
                                src={logo.url}
                                alt={logo.name}
                                className="max-h-full max-w-[120px] lg:max-w-[140px] object-contain"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
