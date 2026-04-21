export const navigationConfig = {
  main: [
    { label: "Inicio", href: "/" },
    { label: "El Club", href: "/club" },
    { label: "Reservas", href: "/reservas" },
    { label: "Clases", href: "/clases" },
    { label: "Tienda", href: "/tienda" },
    { label: "Eventos", href: "/eventos" },
    { label: "Galería", href: "/galeria" },
    { label: "Contacto", href: "/contacto" },
  ],
  footer: {
    club: [
      { label: "El Club", href: "/club" },
      { label: "Instalaciones", href: "/club#instalaciones" },
      { label: "Nuestro equipo", href: "/club#equipo" },
      { label: "Galería", href: "/galeria" },
    ],
    services: [
      { label: "Reservar Cancha", href: "/reservas" },
      { label: "Clases y Academia", href: "/clases" },
      { label: "Torneos y Eventos", href: "/eventos" },
      { label: "Tienda Online", href: "/tienda" },
    ],
    info: [
      { label: "FAQ", href: "/faq" },
      { label: "Contacto", href: "/contacto" },
      { label: "Términos y Condiciones", href: "/legal#terminos" },
      { label: "Política de Privacidad", href: "/legal#privacidad" },
    ],
  },
  admin: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Productos", href: "/admin/productos", icon: "ShoppingBag" },
    { label: "Galería", href: "/admin/galeria", icon: "Image" },
    { label: "Eventos", href: "/admin/eventos", icon: "Calendar" },
    { label: "Clases", href: "/admin/clases", icon: "Users" },
    { label: "FAQ", href: "/admin/faq", icon: "HelpCircle" },
    { label: "Configuración", href: "/admin/configuracion", icon: "Settings" },
  ],
} as const;
