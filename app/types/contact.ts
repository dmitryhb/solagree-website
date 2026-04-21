export interface ContactFormState {
  name: string
  email: string
  phone: string
  message: string
}

export interface ContactPerson {
  name: string
  role: string
  email: string
  phone: string
  imageSrc: string
}

export interface DirectContactItem {
  title: string
  detail: string
  actionLabel: string
  href: string
  iconSrc: string
}
