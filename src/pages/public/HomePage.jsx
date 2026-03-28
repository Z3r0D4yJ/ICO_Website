import Hero from '@/components/home/Hero'
import ServicesPreview from '@/components/home/ServicesPreview'
import WhyICO from '@/components/home/WhyICO'
import WashbusShowcase from '@/components/home/WashbusShowcase'
import TestimonialsSlider from '@/components/home/TestimonialsSlider'
import FAQPreview from '@/components/home/FAQPreview'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <WhyICO />
      <WashbusShowcase />
      <TestimonialsSlider />
      <FAQPreview />
      <CTASection />
    </>
  )
}
