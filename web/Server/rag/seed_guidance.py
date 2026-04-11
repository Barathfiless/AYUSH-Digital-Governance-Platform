"""
Seeds the RAG guidance knowledge base with built-in AYUSH information.
Run once: python seed_guidance.py
"""
import json
import urllib.request
import urllib.error

AYUSH_DOCUMENTS = [
    {
        "title": "AYUSH Product Licensing Overview",
        "source": "AYUSH Ministry Guidelines",
        "content": """
AYUSH stands for Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy. 
The Ministry of AYUSH regulates the production, sale, and licensing of all traditional 
medicine products in India. To sell an AYUSH product, manufacturers must obtain a 
license from the state licensing authority under the Drugs and Cosmetics Act. 
Products must comply with pharmacopoeia standards and Good Manufacturing Practice (GMP) guidelines.
Required documents include: Manufacturing license, GMP certificate, Formula composition, 
Safety data sheet, and Quality control test reports.
        """
    },
    {
        "title": "Ayurveda - Core Principles",
        "source": "AYUSH Knowledge Base",
        "content": """
Ayurveda is a 5000-year-old system of medicine from India based on the concept of 
doshas: Vata (air/space), Pitta (fire/water), and Kapha (water/earth). 
Common Ayurvedic herbs include: Ashwagandha (adaptogen, stress relief), Triphala (digestive health),
Brahmi (cognitive function), Turmeric (anti-inflammatory), Neem (antibacterial),
Giloy (immunity booster), Amla (Vitamin C, hair health), Shatavari (women's health).
Ayurvedic treatments focus on holistic wellness, lifestyle changes, and natural remedies.
        """
    },
    {
        "title": "AYUSH Product Categories",
        "source": "AYUSH Ministry Classification",
        "content": """
AYUSH products are classified into: 
1. Classical medicines - traditional formulations from Ayurvedic texts.
2. Proprietary medicines - new formulations by manufacturers following AYUSH principles.
3. Nutraceuticals and health supplements under AYUSH guidelines.
4. Cosmetics with Ayurvedic claims.
5. Yoga-related wellness products.
Products for digestion include: Triphala, Hingvastak churna, Lavangadi vati.
Products for immunity: Chyawanprash, Giloy tablets, Tulsi extract.
Products for stress and sleep: Ashwagandha capsules, Brahmi ghrita, Shankhpushpi syrup.
        """
    },
    {
        "title": "Unani Medicine Guidelines",
        "source": "AYUSH Knowledge Base",
        "content": """
Unani medicine is based on the teachings of Hippocrates and Galen, developed in the 
Greek-Arabic tradition. It uses four elements: Fire, Water, Earth, and Air. 
Common Unani remedies include: Sharbat (herbal syrups), Majun (electuaries), 
Itrifal (compound formulations). Popular herbs: Mulethi (liquorice), Behman (Salvia), 
Ushba (sarsaparilla). Unani is particularly effective for skin disorders, liver problems, 
sexual health, and respiratory conditions.
        """
    },
    {
        "title": "Homeopathy Under AYUSH",
        "source": "AYUSH Knowledge Base",
        "content": """
Homeopathy operates on the principle of 'like cures like' using highly diluted natural substances.
Common remedies: Arnica (trauma), Belladonna (fever), Nux Vomica (digestive issues),
Rhus Tox (joint pain), Pulsatilla (respiratory). Homeopathic medicines are regulated 
under the Drugs and Cosmetics Act in India. The Central Council of Homeopathy oversees 
education and practice standards.
        """
    },
    {
        "title": "Siddha Medical System",
        "source": "AYUSH Knowledge Base",
        "content": """
Siddha is one of the oldest systems of medicine, practiced primarily in Tamil Nadu.
It uses 96 primary elements and emphasizes pulse diagnosis (Nadi pariksha).
Key formulations: Kalpam (herbo-mineral preparations), Chenduram (calcinated preparations),
Parpam (ash preparations). Common Siddha herbs: Nilavembu (fever), Sida cordifolia (rejuvenation).
Siddha is particularly effective for skin diseases and sexually transmitted infections.
        """
    },
    {
        "title": "License Application Requirements",
        "source": "AYUSH Gateway Portal",
        "content": """
To apply for an AYUSH product license through this portal, you need:
1. Company registration certificate
2. Manufacturing facility details
3. GMP (Good Manufacturing Practice) certificate  
4. Product formula and composition details
5. Quality control test reports from a certified lab
6. Company PAN and GST details
7. Authorized signatory documents
8. Product safety data sheet
The review process takes 15-30 working days. Licenses are valid for 5 years and 
can be renewed through the portal before expiry.
        """
    },
    {
        "title": "AYUSH Quality Standards",
        "source": "AYUSH Ministry Guidelines",
        "content": """
All AYUSH products must meet the standards specified in the respective pharmacopoeias:
- Ayurvedic Pharmacopoeia of India (API)
- Unani Pharmacopoeia of India (UPI)  
- Siddha Pharmacopoeia of India (SPI)
- Homeopathic Pharmacopoeia of India (HPI)
Quality tests include: Heavy metal testing, pesticide residue analysis, 
microbial contamination tests, and identity/purity tests. 
All licensed products receive an AYUSH Grade certification displayed in the Gateway portal.
        """
    }
]

if __name__ == "__main__":
    try:
        body = json.dumps({"documents": AYUSH_DOCUMENTS}).encode("utf-8")
        req  = urllib.request.Request(
            "http://localhost:5001/rag/index/guidance",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        print(f"✅ Seeded {data.get('indexed', 0)} document chunks into guidance knowledge base.")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure rag_service.py is running first: python rag_service.py")
