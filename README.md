# Vardiya Yönetim Sistemi

Basit bir vardiya yönetim uygulaması. Kullanıcılar, departmanlar ve vardiyalar yönetilebilir, yaklaşan vardiyalar görüntülenebilir.

## Özellikler

- Kullanıcı yönetimi (ekleme, güncelleme, silme)
- Departman yönetimi
- Vardiya yönetimi ve görüntüleme
- Yaklaşan vardiyalar paneli
- Vardiya değişim istekleri
- Cypress ile temel frontend testleri

## Teknolojiler

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Ruby on Rails 8 (API only)
- **Veritabanı:** SQLite / PostgreSQL (ortama göre)
- **Test:** Cypress

## Kurulum

### Backend

```bash
cd vardiya-backend
bundle install
rails db:create db:migrate db:seed
rails server
