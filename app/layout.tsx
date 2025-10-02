export const metadata = {
  title: 'VotaCondôminos',
  description: 'Sistema de votação para condomínios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}