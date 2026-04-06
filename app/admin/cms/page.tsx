import { CmsBannersManager } from '@/components/cms/cms-banners-manager'

export default function AdminCmsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">CMS</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Upload banner images directly (no manual storage URLs required). Each slot shows where it appears on the site
          and the recommended size. Changes apply to the home page, shop, about, and the login/sign-up modal.
        </p>
      </div>
      <CmsBannersManager />
    </div>
  )
}
