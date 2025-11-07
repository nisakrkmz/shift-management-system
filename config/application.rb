# config/application.rb
require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Vardiya
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Ignore lib subdirectories that don't contain .rb files
    config.autoload_lib(ignore: %w[assets tasks])

    # API-only mode
    config.api_only = true

    # --- Middleware eklemeleri (frontend ve Cypress için) ---
    # CORS (Cross-Origin) izinleri
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*' # development için, production'da frontend domainini yaz
        resource '*',
                 headers: :any,
                 methods: [:get, :post, :patch, :put, :delete, :options, :head]
      end
    end

    # Cookies ve Session desteği (Next.js veya Cypress testleri için)
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
    config.middleware.use ActionDispatch::Flash
  end
end
