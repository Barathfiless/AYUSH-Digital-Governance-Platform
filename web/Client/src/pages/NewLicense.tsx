import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Building2,
    MapPin,
    Wallet,
    Package,
    ArrowRight,
    Plus,
    PlusCircle,
    Trash2,
    Calendar,
    ArrowLeft,
    Upload,
    FileText,
    Eye,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

const STATE_CITIES: Record<string, string[]> = {
    "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni"],
    "arunachal-pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Along", "Tezu", "Naharlagun", "Bomdila"],
    "assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Bongaigaon", "Tezpur", "Dhubri", "Diphu", "North Lakhimpur", "Karimganj"],
    "bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Saharsa", "Sasaram", "Hajipur", "Motihari"],
    "chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund"],
    "goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"],
    "gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Anand", "Morbi", "Mahesana", "Surendranagar", "Bharuch", "Valsad", "Navsari", "Veraval"],
    "haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Sirsa", "Bhiwani", "Bahadurgarh"],
    "himachal-pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Nahan", "Paonta Sahib", "Una", "Kullu", "Hamirpur"],
    "jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Sahibganj"],
    "karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Raichur", "Bidar", "Hassan", "Gadag-Betageri", "Udupi", "Hospet"],
    "kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad"],
    "madhya-pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara"],
    "maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Akola", "Jalgaon", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Satara", "Beed"],
    "manipur": ["Imphal", "Thoubal", "Churachandpur", "Kakching", "Ukhrul", "Senapati"],
    "meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Cherrapunji", "Baghmara"],
    "mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip"],
    "nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon"],
    "odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Rayagada"],
    "punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara"],
    "rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Barmer", "Churu", "Jhunjhunu"],
    "sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Singtam", "Rangpo"],
    "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tiruppur", "Vellore", "Thoothukudi", "Nagercoil", "Thanjavur", "Dindigul", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Hosur", "Kanchipuram", "Neyveli", "Kumbakonam", "Karaikudi"],
    "telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Mancherial"],
    "tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai"],
    "uttar-pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya", "Etawah", "Roorkee"],
    "uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Ramnagar"],
    "west-bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Maheshtala", "Rajpur Sonarpur", "Gopalpur", "Bhatpara", "Panihati", "Kamarhati", "Bardhaman", "Kulti", "Bally", "Barasat"],
    "andaman-and-nicobar-islands": ["Port Blair", "Diglipur", "Mayabunder", "Rangat"],
    "chandigarh": ["Chandigarh"],
    "dadra-and-nagar-haveli-and-daman-and-diu": ["Daman", "Silvassa", "Diu"],
    "lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"],
    "delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Shahdara", "Rohini", "Dwarka"],
    "puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "jammu-and-kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Udhampur", "Pulwama"],
    "ladakh": ["Leh", "Kargil"]
};

const STATE_PINCODE_PREFIXES: Record<string, string[]> = {
    "delhi": ["11"],
    "haryana": ["12", "13"],
    "punjab": ["14", "15"],
    "chandigarh": ["16"],
    "himachal-pradesh": ["17"],
    "jammu-and-kashmir": ["18", "19"],
    "ladakh": ["18", "19"],
    "uttar-pradesh": ["20", "21", "22", "23", "24", "25", "26", "27", "28"],
    "uttarakhand": ["24", "26"],
    "rajasthan": ["30", "31", "32", "33", "34"],
    "gujarat": ["36", "37", "38", "39"],
    "dadra-and-nagar-haveli-and-daman-and-diu": ["39"],
    "maharashtra": ["40", "41", "42", "43", "44"],
    "goa": ["403"],
    "madhya-pradesh": ["45", "46", "47", "48"],
    "chhattisgarh": ["49"],
    "andhra-pradesh": ["51", "52", "53"],
    "telangana": ["50"],
    "karnataka": ["56", "57", "58", "59"],
    "tamil-nadu": ["60", "61", "62", "63", "64"],
    "puducherry": ["605"],
    "kerala": ["67", "68", "69"],
    "lakshadweep": ["682"],
    "west-bengal": ["70", "71", "72", "73", "74"],
    "odisha": ["75", "76", "77"],
    "assam": ["78"],
    "sikim": ["737"],
    "arunachal-pradesh": ["79"],
    "manipur": ["79"],
    "meghalaya": ["79"],
    "mizoram": ["79"],
    "nagaland": ["79"],
    "tripura": ["79"],
    "andaman-and-nicobar-islands": ["744"],
    "bihar": ["80", "81", "82", "83", "84", "85"],
    "jharkhand": ["81", "82", "83"]
};

export default function NewLicense() {
    usePageTitle('Apply for License');
    const [step, setStep] = useState(1);
    const [isFormStarted, setIsFormStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userApplications, setUserApplications] = useState<any[]>([]);
    const navigate = useNavigate();
    const { key } = useLocation();

    useEffect(() => {
        setIsFormStarted(false);
    }, [key]);

    const totalSteps = 4;

    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        companyName: '',
        gstin: '',
        panNumber: '',
        aadharNumber: '',
        drugLicenseNumber: '',
        incorporationDate: '',
        founderName: '',
        founderEmail: '',
        employeeCount: '',
        products: [{ name: '', category: 'Ayurveda', type: 'Tablet', strength: '' }],
        // Step 3: Address
        registeredAddress: '',
        state: '',
        city: '',
        pinCode: '',
        // Step 4: Financials
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        fundingStage: '',
        annualRevenue: '',
        // Step 5: Documents
        documents: [] as { title: string; url: string; type: string }[]
    });

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userId = userData?._id || userData?.id;

        if (userData && Object.keys(userData).length > 0) {
            const formattedAadhar = (userData.aadhar || '').replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';

            // Initialize base data from user registration info
            const baseFormData = {
                companyName: '',
                gstin: '',
                panNumber: userData.pan || '',
                aadharNumber: formattedAadhar,
                drugLicenseNumber: '',
                incorporationDate: '',
                founderName: userData.name || '',
                founderEmail: userData.email || '',
                employeeCount: '',
                products: [{ name: '', category: 'Ayurveda', type: 'Tablet', strength: '' }],
                registeredAddress: '',
                state: '',
                city: '',
                pinCode: '',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                fundingStage: '',
                annualRevenue: '',
                documents: [] as { title: string; url: string; type: string }[]
            };

            // Try to load draft
            const savedDraft = localStorage.getItem('ayush_license_draft');
            if (savedDraft) {
                try {
                    const parsedDraft = JSON.parse(savedDraft);
                    // Only load draft if it belongs to the current user
                    if (parsedDraft.userId === userId) {
                        setFormData({
                            ...baseFormData,
                            ...parsedDraft.formData,
                            // Ensure these fields ALWAYS come from user registration data
                            panNumber: userData.pan || parsedDraft.formData.panNumber || '',
                            aadharNumber: formattedAadhar || parsedDraft.formData.aadharNumber || '',
                            founderName: userData.name || parsedDraft.formData.founderName || '',
                            founderEmail: userData.email || parsedDraft.formData.founderEmail || ''
                        });
                        if (parsedDraft.step) setStep(parsedDraft.step);
                    } else {
                        // Draft for another user, just use base data
                        setFormData(baseFormData);
                    }
                } catch (e) {
                    console.error("Error parsing draft", e);
                    setFormData(baseFormData);
                }
            } else {
                // No draft, just use base data
                setFormData(baseFormData);
            }

            // Fetch existing applications
            const fetchApps = async () => {
                if (!userId) return;
                try {
                    const response = await fetch(`/api/applications/user/${userId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUserApplications(data);
                    }
                } catch (error) {
                    console.error("Error fetching applications:", error);
                }
            };
            fetchApps();
        }
    }, []);

    // Auto-save effect
    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userId = userData?._id || userData?.id;

        if (userId && isFormStarted) {
            const draftData = {
                userId,
                step,
                formData
            };
            try {
                localStorage.setItem('ayush_license_draft', JSON.stringify(draftData));
            } catch (e) {
                console.error("Failed to auto-save draft (likely quota exceeded)", e);
                // Optionally try to save without documents if quota failed
                try {
                    const draftWithoutDocs = { ...draftData, formData: { ...formData, documents: [] } };
                    localStorage.setItem('ayush_license_draft', JSON.stringify(draftWithoutDocs));
                } catch (e2) {
                    // Ignore
                }
            }
        }
    }, [formData, step, isFormStarted]);

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docTitle: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isPhoto = docTitle === "Owner's passport size photo" || docTitle === "Company photo";
        const limit = isPhoto ? 150 * 1024 : 2 * 1024 * 1024;
        const limitStr = isPhoto ? "150KB" : "2MB";

        if (file.size > limit) {
            toast.error(`File size must be less than ${limitStr}`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const newDocs = formData.documents.filter(d => d.title !== docTitle);
            newDocs.push({
                title: docTitle,
                url: base64String,
                type: file.type
            });
            updateFormData('documents', newDocs);
            toast.success(`${docTitle} uploaded`);
        };
        reader.readAsDataURL(file);
    };

    const removeDocument = (docTitle: string) => {
        const newDocs = formData.documents.filter(d => d.title !== docTitle);
        updateFormData('documents', newDocs);
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
            const userId = userData?._id || userData?.id;

            if (!userId) {
                toast.error("User session not found. Please login again.");
                setIsLoading(false);
                return;
            }

            // Final safety check for required fields before submission
            const submissionData = {
                ...formData,
                companyName: formData.companyName || userData.name || 'Ayush Startup', // Fallback to avoid 500
                userId: userId,
                products: formData.products.filter(p => p.name.trim() !== "") // Clean up any empty product templates
            };

            if (!submissionData.companyName.trim()) {
                toast.error("Company Name is required to file a license.");
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/applications/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Application Submitted Successfully!', {
                    description: 'Your license application is being processed.',
                });
                localStorage.removeItem('ayush_license_draft');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                toast.error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isFormStarted) {
        return (
            <DashboardLayout>
                <div className="max-w-[1400px] mx-auto pb-8 pt-0 px-4">
                    <div className="flex justify-end mb-6 px-4">
                        <Button
                            onClick={() => setIsFormStarted(true)}
                            className="h-11 px-6 bg-[#001b3d] hover:bg-[#002b5b] rounded-xl text-xs font-bold gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all text-white border-none"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Start New Application
                        </Button>
                    </div>

                    {userApplications.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-20 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <PlusCircle className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No Active Applications</h3>
                            <p className="text-slate-500 mt-2 mb-8 max-w-sm mx-auto">Initialize your registration process by clicking 'Start New Application' above.</p>
                        </motion.div>
                    )}

                    {userApplications.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {userApplications.map((app) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center p-3 gap-0 group h-24 overflow-hidden"
                                >
                                    {/* Thumbnail Column - Standard Width */}
                                    <div className="w-40 h-20 rounded-lg overflow-hidden shrink-0 ml-1 relative">
                                        <div className="w-full h-full bg-slate-50 relative">
                                            <img
                                                src={app.documents?.find((d: any) => d.title === "Company photo")?.url || "https://images.unsplash.com/photo-1563483338-751bd9ed71cd?w=400&h=200&q=80&auto=format&fit=crop"}
                                                alt={app.companyName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&q=80&auto=format&fit=crop';
                                                }}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                        <div className="absolute bottom-2 left-2">
                                            <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/30 uppercase tracking-widest">
                                                {app.companyName?.substring(0, 1) || 'A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Company Info Column - Flexible but with weight */}
                                    <div className="flex-[2] min-w-0 px-6">
                                        <h3 className="text-base font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                                            {app.companyName}
                                        </h3>

                                    </div>

                                    {/* ID Column - Standardized */}
                                    <div className="flex-1 hidden md:flex flex-col px-4 border-l border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Dossier ID</span>
                                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100 w-fit">
                                            {app.applicationId || 'GEN-PENDING'}
                                        </span>
                                    </div>

                                    {/* Date Column - Standardized */}
                                    <div className="flex-1 hidden lg:flex flex-col px-4 border-l border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Filing Date</span>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="text-xs font-bold">
                                                {new Date(app.submittedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Combined Action Area - Fixed Width */}
                                    <div className="shrink-0 flex items-center gap-3 px-8 border-l border-slate-100 h-full">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/track?id=${app.applicationId || app._id}`)}
                                            className="rounded-xl h-11 px-8 font-black text-[10px] uppercase border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-all shadow-sm"
                                        >
                                            Track
                                        </Button>
                                        <Button
                                            onClick={() => navigate(`/application/${app._id}`)}
                                            className="rounded-xl h-11 px-6 font-black text-[10px] uppercase bg-[#001b3d] hover:bg-[#002b5b] text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                                        >
                                            View Dossier
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col-reverse lg:flex-row gap-6 items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-700">Company Name *</label>
                                    <Input
                                        placeholder="Enter your legal company name"
                                        value={formData.companyName}
                                        onChange={(e) => updateFormData('companyName', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">GSTIN *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.gstin}
                                        onChange={(e) => updateFormData('gstin', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">PAN Number *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.panNumber}
                                        readOnly
                                        className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Aadhar Number *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.aadharNumber}
                                        readOnly
                                        className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Drug License Number (if renewal)</label>
                                    <Input
                                        placeholder=""
                                        value={formData.drugLicenseNumber}
                                        onChange={(e) => updateFormData('drugLicenseNumber', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                    <p className="text-[10px] text-slate-400">Leave blank for new applications</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Incorporation Date *</label>
                                    <Input
                                        type="date"
                                        value={formData.incorporationDate}
                                        onChange={(e) => updateFormData('incorporationDate', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Founder/Director Name *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.founderName}
                                        readOnly
                                        className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Founder Email *</label>
                                    <Input
                                        type="email"
                                        placeholder=""
                                        value={formData.founderEmail}
                                        readOnly
                                        className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-700">Number of Employees</label>
                                    <Select value={formData.employeeCount} onValueChange={(v) => updateFormData('employeeCount', v)}>
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200">
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10</SelectItem>
                                            <SelectItem value="11-50">11-50</SelectItem>
                                            <SelectItem value="51-200">51-200</SelectItem>
                                            <SelectItem value="200+">200+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="shrink-0 w-full lg:w-40 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block text-center lg:text-left">Owner's Photo *</label>
                                    <div className="relative group/photo mx-auto lg:mx-0">
                                        <div className={cn(
                                            "w-40 h-40 rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 relative",
                                            formData.documents.find(d => d.title === "Owner's passport size photo")
                                                ? "border-blue-100 bg-white"
                                                : "border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30"
                                        )}>
                                            {formData.documents.find(d => d.title === "Owner's passport size photo") ? (
                                                <>
                                                    <img
                                                        src={formData.documents.find(d => d.title === "Owner's passport size photo")?.url}
                                                        alt="Passport Photo"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-white hover:bg-white/20 h-9 w-9 rounded-full"
                                                            onClick={() => {
                                                                const uploadedDoc = formData.documents.find(d => d.title === "Owner's passport size photo");
                                                                if (uploadedDoc) {
                                                                    const newWindow = window.open();
                                                                    if (newWindow) {
                                                                        newWindow.document.write(
                                                                            `<html><body style="margin:0;padding:0;overflow:hidden;"><iframe src="${uploadedDoc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe></body></html>`
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-white hover:bg-rose-500 h-9 w-9 rounded-full"
                                                            onClick={() => removeDocument("Owner's passport size photo")}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 border border-slate-100 group-hover/photo:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 group-hover:text-blue-600">Upload Photo</p>
                                                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider">Square / JPG / 150KB</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileUpload(e, "Owner's passport size photo")}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 block text-center lg:text-left">Company Photo *</label>
                                    <div className="relative group/comp-photo mx-auto lg:mx-0">
                                        <div className={cn(
                                            "w-40 h-40 rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 relative",
                                            formData.documents.find(d => d.title === "Company photo")
                                                ? "border-blue-100 bg-white"
                                                : "border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30"
                                        )}>
                                            {formData.documents.find(d => d.title === "Company photo") ? (
                                                <>
                                                    <img
                                                        src={formData.documents.find(d => d.title === "Company photo")?.url}
                                                        alt="Company Photo"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/comp-photo:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-white hover:bg-white/20 h-9 w-9 rounded-full"
                                                            onClick={() => {
                                                                const uploadedDoc = formData.documents.find(d => d.title === "Company photo");
                                                                if (uploadedDoc) {
                                                                    const newWindow = window.open();
                                                                    if (newWindow) {
                                                                        newWindow.document.write(
                                                                            `<html><body style="margin:0;padding:0;overflow:hidden;"><iframe src="${uploadedDoc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe></body></html>`
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-white hover:bg-rose-500 h-9 w-9 rounded-full"
                                                            onClick={() => removeDocument("Company photo")}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 border border-slate-100 group-hover/comp-photo:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 group-hover:text-blue-600">Upload Photo</p>
                                                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider">Square / JPG / 150KB</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileUpload(e, "Company photo")}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Registered Address *</label>
                                <Textarea
                                    placeholder=""
                                    value={formData.registeredAddress}
                                    onChange={(e) => updateFormData('registeredAddress', e.target.value)}
                                    className="min-h-[100px] rounded-lg border-slate-200 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">State *</label>
                                    <Select
                                        value={formData.state}
                                        onValueChange={(v) => {
                                            setFormData(prev => ({ ...prev, state: v, city: '' }));
                                        }}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200">
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDIAN_STATES.map(state => (
                                                <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">City *</label>
                                    <Select
                                        value={formData.city}
                                        onValueChange={(v) => updateFormData('city', v)}
                                        disabled={!formData.state}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200">
                                            <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {formData.state && STATE_CITIES[formData.state]?.map(city => (
                                                <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, '-')}>
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">PIN Code *</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="6-digit PIN code"
                                            value={formData.pinCode}
                                            maxLength={6}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                updateFormData('pinCode', val);

                                                if (val.length === 6 && formData.state) {
                                                    const prefixes = STATE_PINCODE_PREFIXES[formData.state] || [];
                                                    const isValid = prefixes.some(p => val.startsWith(p));
                                                    if (!isValid) {
                                                        toast.error(`Invalid PIN Code for ${formData.state.replace(/-/g, ' ')}`);
                                                    }
                                                }
                                            }}
                                            className={cn(
                                                "h-10 rounded-xl border-slate-200 focus:ring-blue-500 pr-10",
                                                formData.pinCode.length === 6 && formData.state && (STATE_PINCODE_PREFIXES[formData.state] || []).some(p => formData.pinCode.startsWith(p)) && "border-green-500 focus:ring-green-500"
                                            )}
                                        />
                                        {formData.pinCode.length === 6 && formData.state && (STATE_PINCODE_PREFIXES[formData.state] || []).some(p => formData.pinCode.startsWith(p)) && (
                                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Bank Name *</label>
                                <Input
                                    placeholder=""
                                    value={formData.bankName}
                                    onChange={(e) => updateFormData('bankName', e.target.value)}
                                    className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Account Number *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.accountNumber}
                                        onChange={(e) => updateFormData('accountNumber', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">IFSC Code *</label>
                                    <Input
                                        placeholder=""
                                        value={formData.ifscCode}
                                        onChange={(e) => updateFormData('ifscCode', e.target.value)}
                                        className="h-10 rounded-xl border-slate-200 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Funding Stage</label>
                                    <Select value={formData.fundingStage} onValueChange={(v) => updateFormData('fundingStage', v)}>
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200">
                                            <SelectValue placeholder="Select stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                                            <SelectItem value="seed">Seed</SelectItem>
                                            <SelectItem value="series-a">Series A</SelectItem>
                                            <SelectItem value="series-b">Series B+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Annual Revenue (Optional)</label>
                                    <Select value={formData.annualRevenue} onValueChange={(v) => updateFormData('annualRevenue', v)}>
                                        <SelectTrigger className="h-10 rounded-xl border-slate-200">
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-10l">₹0 - ₹10 Lakhs</SelectItem>
                                            <SelectItem value="10l-50l">₹10 Lakhs - ₹50 Lakhs</SelectItem>
                                            <SelectItem value="50l-2cr">₹50 Lakhs - ₹2 Crores</SelectItem>
                                            <SelectItem value="2cr+">₹2 Crores+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800">Upload Required Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['PAN Card', 'Aadhar Card', 'Certificate of Incorporation', 'DPIIT Startup Recognition Certificate'].map((docTitle) => {
                                    const uploadedDoc = formData.documents.find(d => d.title === docTitle);
                                    const isPhoto = false; // All remaining documents are standard size limits
                                    return (
                                        <div key={docTitle} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4 transition-all duration-300 group/item hover:shadow-md hover:border-blue-200">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div
                                                    className={cn(
                                                        "w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-all duration-300 relative border",
                                                        uploadedDoc
                                                            ? "bg-white border-slate-200 shadow-sm group-hover/item:scale-105"
                                                            : "bg-slate-50 text-slate-300 border-slate-100 border-dashed"
                                                    )}
                                                    onClick={() => {
                                                        if (uploadedDoc) {
                                                            const newWindow = window.open();
                                                            if (newWindow) {
                                                                newWindow.document.write(
                                                                    `<html><body style="margin:0;padding:0;overflow:hidden;"><iframe src="${uploadedDoc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe></body></html>`
                                                                );
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {uploadedDoc ? (
                                                        uploadedDoc.type.includes('image') ? (
                                                            <img
                                                                src={uploadedDoc.url}
                                                                alt={docTitle}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50/50">
                                                                <FileText className="w-8 h-8 text-blue-600 mb-1" />
                                                                <span className="text-[8px] font-black text-blue-700 uppercase tracking-tighter">PDF VIEW</span>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <Upload className="w-5 h-5 opacity-20" />
                                                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-20">EMPTY</span>
                                                        </div>
                                                    )}

                                                    {uploadedDoc && (
                                                        <div className="absolute inset-0 bg-blue-600/0 group-hover/item:bg-blue-600/5 transition-colors flex items-center justify-center">
                                                            <Eye className="w-5 h-5 text-white opacity-0 group-hover/item:opacity-100 transition-opacity drop-shadow-md" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800 text-sm truncate group-hover/item:text-blue-600 transition-colors" title={docTitle}>{docTitle}</p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {uploadedDoc ? "Ready to submit" : isPhoto ? "JPG (Max 150KB)" : "PDF or JPG (Max 2MB)"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                {uploadedDoc ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeDocument(docTitle)}
                                                        className="text-rose-500 hover:bg-rose-50 rounded-xl"
                                                        type="button"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept={isPhoto ? "image/*" : "image/*,.pdf"}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => handleFileUpload(e, docTitle)}
                                                        />
                                                        <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 h-9 text-xs">
                                                            <Upload className="w-3.5 h-3.5 mr-2" /> Upload
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1000px] mx-auto pb-10">
                {/* Header with Back Button */}
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => setIsFormStarted(false)}
                        className="rounded-xl hover:bg-slate-100 gap-2 font-bold text-slate-600 px-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Button>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-8 px-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -z-10 -translate-y-1/2 transition-all duration-500"
                        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>

                    {[
                        { s: 1, icon: Building2, label: 'Company' },
                        { s: 2, icon: MapPin, label: 'Address' },
                        { s: 3, icon: Wallet, label: 'Financials' },
                        { s: 4, icon: FileText, label: 'Documents' },
                    ].map((item) => (
                        <div key={item.s} className="flex flex-col items-center">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm",
                                step >= item.s ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-100"
                            )}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold mt-2 uppercase tracking-wider",
                                step >= item.s ? "text-blue-600" : "text-slate-400"
                            )}>{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>
                    </div>

                    <div className="px-6 py-4 md:px-8 md:py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={() => step === 1 ? setIsFormStarted(false) : prevStep()}
                            className="h-10 px-6 rounded-xl border-slate-200 gap-2 font-bold text-slate-600"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Button>

                        {step < totalSteps ? (
                            <Button
                                onClick={nextStep}
                                className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 gap-2 font-bold shadow-lg shadow-blue-200"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="h-10 px-6 rounded-xl bg-[#002b5b] hover:bg-[#1a406d] gap-2 font-bold shadow-lg shadow-blue-900/20"
                            >
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                                {!isLoading && <CheckCircle2 className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        By submitting this form, you certify that the information provided is accurate and complies with Ministry of Ayush regulations.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
