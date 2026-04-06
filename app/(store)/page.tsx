import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/hero-section'
import { HowItWorks } from '@/components/how-it-works'
import { CategoriesSection } from '@/components/categories-section'
import { FeaturedProducts } from '@/components/featured-products'
import { HomePromoBanners } from '@/components/home-promo-banners'
import { HomeTrendingTabs } from '@/components/home-trending-tabs'
import { HomeDealsSection } from '@/components/home-deals-section'
import { HomeTrendingWeek } from '@/components/home-trending-week'
import { HomeRecommendedCategories } from '@/components/home-recommended-categories'
import { HomeBrandsStrip } from '@/components/home-brands-strip'
import { HomeNewsletter } from '@/components/home-newsletter'
import { CmsSlotBanner } from '@/components/cms/cms-slot-banner'
import { type Category, type CmsSiteSettings, type Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: cmsData } = await supabase.from('cms_site_settings').select('*').eq('id', 1).maybeSingle()
  const cms = cmsData as CmsSiteSettings | null

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const { data: catalogRaw } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(48)

  const catalog = (catalogRaw || []) as Product[]

  const dealProducts = catalog
    .filter((p) => p.compare_price != null && Number(p.compare_price) > Number(p.price))
    .slice(0, 6)

  const weekProducts = catalog.slice(0, 8)

  return (
    <>
      <CmsSlotBanner cms={cms} slotId="home_hero_wide" priority />
      <HeroSection cms={cms} />
      <CategoriesSection categories={(categories as Category[]) || []} />
      <HomePromoBanners cms={cms} />
      <FeaturedProducts products={(featuredProducts as Product[]) || []} />
      <HomeTrendingTabs categories={(categories as Category[]) || []} products={catalog} />
      <HomeDealsSection products={dealProducts} />
      <HomeTrendingWeek products={weekProducts} />
      <HowItWorks />
      <HomeRecommendedCategories categories={(categories as Category[]) || []} />
      <HomeBrandsStrip />
      <HomeNewsletter />
    </>
  )
}
