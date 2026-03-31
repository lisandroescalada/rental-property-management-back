-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `access_logs`
--

CREATE TABLE `access_logs` (
                               `id` bigint UNSIGNED NOT NULL,
                               `user_id` bigint UNSIGNED NOT NULL,
                               `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `user_agent` text COLLATE utf8mb4_unicode_ci,
                               `logged_in_at` timestamp NOT NULL,
                               `created_at` timestamp NULL DEFAULT NULL,
                               `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `access_logs`
--

INSERT INTO `access_logs` (`id`, `user_id`, `ip_address`, `user_agent`, `logged_in_at`, `created_at`, `updated_at`) VALUES
                                                                                                                        (1, 1, '172.19.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2026-03-31 18:18:59', '2026-03-31 18:18:59', '2026-03-31 18:18:59'),
                                                                                                                        (2, 1, '172.19.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2026-03-31 18:20:05', '2026-03-31 18:20:05', '2026-03-31 18:20:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agencies`
--

CREATE TABLE `agencies` (
                            `id` bigint UNSIGNED NOT NULL,
                            `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `is_active` tinyint(1) NOT NULL DEFAULT '0',
                            `settings` json DEFAULT NULL,
                            `plan_id` bigint UNSIGNED DEFAULT NULL,
                            `created_at` timestamp NULL DEFAULT NULL,
                            `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `agencies`
--

INSERT INTO `agencies` (`id`, `name`, `slug`, `is_active`, `settings`, `plan_id`, `created_at`, `updated_at`) VALUES
                                                                                                                  (1, 'Acme Agency', 'acme-agency', 0, NULL, 2, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                  (2, 'Acme Owner Agency', 'acme-owner-agency', 1, NULL, 2, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                  (3, 'Best Rentals', 'best-rentals', 0, NULL, 2, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                  (4, 'Best Owner Agency', 'best-owner-agency', 1, NULL, 2, '2026-03-31 18:18:03', '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agency_user`
--

CREATE TABLE `agency_user` (
                               `id` bigint UNSIGNED NOT NULL,
                               `agency_id` bigint UNSIGNED NOT NULL,
                               `user_id` bigint UNSIGNED NOT NULL,
                               `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'agent',
                               `is_active` tinyint(1) NOT NULL DEFAULT '1',
                               `is_primary` tinyint(1) NOT NULL DEFAULT '0',
                               `invited_at` timestamp NULL DEFAULT NULL,
                               `accepted_at` timestamp NULL DEFAULT NULL,
                               `invited_by_id` bigint UNSIGNED DEFAULT NULL,
                               `accepted_by_id` bigint UNSIGNED DEFAULT NULL,
                               `created_by_id` bigint UNSIGNED DEFAULT NULL,
                               `created_at` timestamp NULL DEFAULT NULL,
                               `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `agency_user`
--

INSERT INTO `agency_user` (`id`, `agency_id`, `user_id`, `role`, `is_active`, `is_primary`, `invited_at`, `accepted_at`, `invited_by_id`, `accepted_by_id`, `created_by_id`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                             (1, 2, 4, 'agent', 1, 0, '2026-03-31 18:18:03', '2026-03-31 18:18:03', NULL, NULL, NULL, NULL, '2026-03-31 18:18:03'),
                                                                                                                                                                                                             (2, 1, 4, 'agent', 1, 1, '2026-03-31 18:18:03', '2026-03-31 18:18:03', NULL, NULL, NULL, NULL, '2026-03-31 18:18:03'),
                                                                                                                                                                                                             (3, 4, 5, 'agent', 1, 0, '2026-03-31 18:18:03', '2026-03-31 18:18:03', NULL, NULL, NULL, NULL, '2026-03-31 18:18:03'),
                                                                                                                                                                                                             (4, 3, 5, 'agent', 1, 1, '2026-03-31 18:18:03', '2026-03-31 18:18:03', NULL, NULL, NULL, NULL, '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deposits`
--

CREATE TABLE `deposits` (
                            `id` bigint UNSIGNED NOT NULL,
                            `created_at` timestamp NULL DEFAULT NULL,
                            `updated_at` timestamp NULL DEFAULT NULL,
                            `property_id` bigint UNSIGNED NOT NULL,
                            `tenant_id` bigint UNSIGNED DEFAULT NULL,
                            `processed_by` bigint UNSIGNED DEFAULT NULL,
                            `amount` decimal(10,2) NOT NULL,
                            `deposit_date` date NOT NULL,
                            `status` enum('retenido','devuelto','parcialmente_devuelto') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'retenido',
                            `return_date` date DEFAULT NULL,
                            `returned_amount` decimal(10,2) DEFAULT NULL,
                            `deducted_amount` decimal(10,2) DEFAULT NULL,
                            `deduction_reason` text COLLATE utf8mb4_unicode_ci,
                            `damage_history` text COLLATE utf8mb4_unicode_ci,
                            `notes` text COLLATE utf8mb4_unicode_ci,
                            `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
                          `id` bigint UNSIGNED NOT NULL,
                          `property_id` bigint UNSIGNED NOT NULL,
                          `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                          `start` date NOT NULL,
                          `end` date NOT NULL,
                          `created_at` timestamp NULL DEFAULT NULL,
                          `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
                               `id` bigint UNSIGNED NOT NULL,
                               `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                               `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
                               `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
                               `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
                               `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
                               `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mercadopago_payment_maps`
--

CREATE TABLE `mercadopago_payment_maps` (
                                            `id` bigint UNSIGNED NOT NULL,
                                            `preference_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                            `payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                            `owner_id` bigint UNSIGNED NOT NULL,
                                            `property_id` bigint UNSIGNED DEFAULT NULL,
                                            `tenant_id` bigint UNSIGNED DEFAULT NULL,
                                            `created_at` timestamp NULL DEFAULT NULL,
                                            `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
                              `id` int UNSIGNED NOT NULL,
                              `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                              `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
                                                          (23, '2014_10_12_000000_create_users_table', 1),
                                                          (24, '2014_10_12_100000_create_password_resets_table', 1),
                                                          (25, '2019_08_19_000000_create_failed_jobs_table', 1),
                                                          (26, '2019_12_14_000001_create_personal_access_tokens_table', 1),
                                                          (27, '2025_02_12_00000_create_rentals_table', 1),
                                                          (28, '2025_02_13_202956_create_permission_tables', 1),
                                                          (29, '2025_02_15_225314_create_notifications_table', 1),
                                                          (30, '2025_03_21_160112_create_property_claims_table', 1),
                                                          (31, '2025_08_30_165302_create_access_logs_table', 1),
                                                          (32, '2025_08_30_213911_create_reviews_table', 1),
                                                          (33, '2025_09_14_135732_create_deposits_table', 1),
                                                          (34, '2025_10_04_000000_create_mercadopago_payment_maps_table', 1),
                                                          (35, '2025_10_29_120000_create_plans_table', 1),
                                                          (36, '2025_10_29_121000_create_subscriptions_table', 1),
                                                          (37, '2025_10_30_120000_create_subscription_payments_table', 1),
                                                          (38, '2025_11_08_000001_create_subscription_events_table', 1),
                                                          (39, '2025_11_11_000001_create_agencies_table', 1),
                                                          (40, '2025_11_11_000002_create_agency_user_table', 1),
                                                          (41, '2025_11_11_000003_add_agency_id_to_properties', 1),
                                                          (42, '2025_11_11_000004_add_agency_id_to_subscriptions', 1),
                                                          (43, '2025_11_15_000000_add_created_by_to_owners_table', 1),
                                                          (44, '2025_11_15_120000_add_agency_id_to_subscription_payments', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
                                         `permission_id` bigint UNSIGNED NOT NULL,
                                         `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                         `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `model_has_roles`
--

CREATE TABLE `model_has_roles` (
                                   `role_id` bigint UNSIGNED NOT NULL,
                                   `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
                                                                        (1, 'App\\Models\\User', 1),
                                                                        (2, 'App\\Models\\User', 2),
                                                                        (2, 'App\\Models\\User', 3),
                                                                        (3, 'App\\Models\\User', 4),
                                                                        (3, 'App\\Models\\User', 5),
                                                                        (4, 'App\\Models\\User', 6),
                                                                        (4, 'App\\Models\\User', 7),
                                                                        (4, 'App\\Models\\User', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
                                 `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `notifiable_id` bigint UNSIGNED NOT NULL,
                                 `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `read_at` timestamp NULL DEFAULT NULL,
                                 `created_at` timestamp NULL DEFAULT NULL,
                                 `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `owners`
--

CREATE TABLE `owners` (
                          `id` bigint UNSIGNED NOT NULL,
                          `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                          `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `dni` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `bank_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `bank_swift` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `mercado_pago_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `mercado_pago_access_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `mercado_pago_public_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `mercado_pago_client_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                          `user_id` bigint UNSIGNED DEFAULT NULL,
                          `created_by_id` bigint UNSIGNED DEFAULT NULL,
                          `created_at` timestamp NULL DEFAULT NULL,
                          `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `owners`
--

INSERT INTO `owners` (`id`, `name`, `phone`, `dni`, `bank_name`, `bank_account`, `bank_swift`, `mercado_pago_account`, `mercado_pago_access_token`, `mercado_pago_public_key`, `mercado_pago_client_id`, `user_id`, `created_by_id`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                                                                                     (1, 'Admin Usuario', '+34600000001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                                                                     (2, 'María López', '+34600000002', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                                                                     (3, 'Laura Martínez', '+34600000003', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
                                   `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
                                                                   ('acme.owner@example.com', '$2y$10$swUgaUM21zlqu7iGp2DEHOYjXeARneMq2ED01vBCva31GCjYL2DuC', '2026-03-31 18:18:03'),
                                                                   ('best.owner@example.com', '$2y$10$RyCGcxsINig7GwaWLhhzjeUmBVOYVndSTKGdrV7ZH7Kxr1tf7W2vO', '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pending_rent_increments`
--

CREATE TABLE `pending_rent_increments` (
                                           `id` bigint UNSIGNED NOT NULL,
                                           `property_id` bigint UNSIGNED NOT NULL,
                                           `previous_price` decimal(10,2) NOT NULL,
                                           `pending_since` timestamp NOT NULL,
                                           `from_date` date NOT NULL,
                                           `to_date` date NOT NULL,
                                           `status` enum('pending','processed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL,
                                           `index_type` enum('IPC','IPCL','IPL','FIJO') COLLATE utf8mb4_unicode_ci NOT NULL,
                                           `increase_percentage` decimal(5,2) DEFAULT NULL,
                                           `new_price` decimal(10,2) DEFAULT NULL,
                                           `is_accumulated` tinyint(1) NOT NULL DEFAULT '0',
                                           `accumulated_periods` json DEFAULT NULL,
                                           `processed_at` timestamp NULL DEFAULT NULL,
                                           `is_estimated` tinyint(1) NOT NULL DEFAULT '0',
                                           `notes` text COLLATE utf8mb4_unicode_ci,
                                           `deleted_at` timestamp NULL DEFAULT NULL,
                                           `created_at` timestamp NULL DEFAULT NULL,
                                           `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
                               `id` bigint UNSIGNED NOT NULL,
                               `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                               `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                               `created_at` timestamp NULL DEFAULT NULL,
                               `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
                                                                                       (1, 'manage properties', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (2, 'manage payments', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (3, 'manage calendar', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (4, 'manage users', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (5, 'manage tenants', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (6, 'manage owners', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (7, 'view payments', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (8, 'view calendar', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (9, 'view properties', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (10, 'view tenants', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (11, 'manage plans', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                       (12, 'manage agents', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
                                          `id` bigint UNSIGNED NOT NULL,
                                          `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                          `tokenable_id` bigint UNSIGNED NOT NULL,
                                          `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                          `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
                                          `abilities` text COLLATE utf8mb4_unicode_ci,
                                          `last_used_at` timestamp NULL DEFAULT NULL,
                                          `created_at` timestamp NULL DEFAULT NULL,
                                          `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plans`
--

CREATE TABLE `plans` (
                         `id` bigint UNSIGNED NOT NULL,
                         `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `description` text COLLATE utf8mb4_unicode_ci,
                         `monthly_price` bigint UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Precio mensual en centavos o unidad menor',
                         `annual_price` bigint UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Precio anual con descuento aplicado',
                         `properties_limit` int DEFAULT NULL COMMENT 'Número máximo de propiedades (null = ilimitado)',
                         `users_limit` int DEFAULT NULL COMMENT 'Número máximo de usuarios (null = ilimitado)',
                         `features` json DEFAULT NULL,
                         `is_active` tinyint(1) NOT NULL DEFAULT '1',
                         `is_custom` tinyint(1) NOT NULL DEFAULT '0',
                         `trial_days` int DEFAULT '14',
                         `created_at` timestamp NULL DEFAULT NULL,
                         `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `plans`
--

INSERT INTO `plans` (`id`, `name`, `slug`, `description`, `monthly_price`, `annual_price`, `properties_limit`, `users_limit`, `features`, `is_active`, `is_custom`, `trial_days`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                                  (1, 'Free', 'free', 'Plan gratuito con funcionalidades básicas limitadas.', 0, 0, 1, 1, '[\"Contratos básicos\", \"Control de pagos\", \"Notificaciones\", \"Informes básicos\"]', 1, 0, 0, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                  (2, 'Starter', 'starter', 'Hasta 15 propiedades, ideal para propietarios individuales o pequeñas gestorías.', 25000, 255000, 15, 2, '[\"Contratos\", \"Control de pagos\", \"Notificaciones\", \"Informes básicos\"]', 1, 0, 14, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                  (3, 'Pro', 'pro', 'Para equipos medianos: reportes avanzados, multiusuario y firma digital básica.', 45000, 459000, 50, 5, '[\"Reportes\", \"Multiusuario con roles\", \"Firma digital básica - próximamente\", \"Soporte prioritario (horario)\"]', 1, 0, 14, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                  (4, 'Enterprise', 'enterprise', 'Solución para empresas: API, BI, branding y onboarding asistido.', 65000, 663000, 300, 10, '[\"API pública\", \"BI / dashboards avanzados\", \"Branding propio\", \"Onboarding asistido\"]', 0, 0, 30, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                                  (5, 'Premium', 'premium', 'Nivel superior con hosting dedicado, SLA y soporte 24/7.', 120000, 1224000, NULL, NULL, '[\"Hosting dedicado / VPC\", \"Soporte 24/7\", \"Integraciones ERP avanzadas\", \"SLA personalizado\"]', 0, 0, 0, '2026-03-31 18:18:02', '2026-03-31 18:18:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `price_indices`
--

CREATE TABLE `price_indices` (
                                 `id` bigint UNSIGNED NOT NULL,
                                 `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `month` int NOT NULL,
                                 `year` int NOT NULL,
                                 `value` decimal(10,2) NOT NULL,
                                 `percentage_variation` decimal(8,2) DEFAULT NULL,
                                 `source` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INDEC',
                                 `created_at` timestamp NULL DEFAULT NULL,
                                 `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `properties`
--

CREATE TABLE `properties` (
                              `id` bigint UNSIGNED NOT NULL,
                              `agency_id` bigint UNSIGNED DEFAULT NULL,
                              `managed_by_user_id` bigint UNSIGNED DEFAULT NULL,
                              `designated_owner_id` bigint UNSIGNED DEFAULT NULL,
                              `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                              `description` text COLLATE utf8mb4_unicode_ci,
                              `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                              `price` decimal(10,2) NOT NULL,
                              `bedrooms` int DEFAULT NULL,
                              `bathrooms` int DEFAULT NULL,
                              `square_meters` int DEFAULT NULL,
                              `available` tinyint(1) NOT NULL DEFAULT '1',
                              `contract_start_date` date NOT NULL,
                              `contract_end_date` date NOT NULL,
                              `insurance_details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                              `rent_increase_type` enum('monthly','quarterly','semi_annual','annual') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                              `rent_increase_percentage` decimal(5,2) DEFAULT NULL,
                              `rent_increase_index_type` enum('IPC','IPCL','IPL','FIJO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                              `rent_increase_factor` decimal(8,2) NOT NULL DEFAULT '1.00',
                              `insurance_date` date DEFAULT NULL,
                              `observations` text COLLATE utf8mb4_unicode_ci,
                              `latitude` decimal(10,7) DEFAULT NULL,
                              `longitude` decimal(10,7) DEFAULT NULL,
                              `property_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
                              `deleted_at` timestamp NULL DEFAULT NULL,
                              `created_at` timestamp NULL DEFAULT NULL,
                              `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `properties`
--

INSERT INTO `properties` (`id`, `agency_id`, `managed_by_user_id`, `designated_owner_id`, `title`, `description`, `address`, `price`, `bedrooms`, `bathrooms`, `square_meters`, `available`, `contract_start_date`, `contract_end_date`, `insurance_details`, `rent_increase_type`, `rent_increase_percentage`, `rent_increase_index_type`, `rent_increase_factor`, `insurance_date`, `observations`, `latitude`, `longitude`, `property_type`, `deleted_at`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              (1, NULL, NULL, 3, 'Calle Principal 100', 'Casa en zona residencial', 'Calle Principal 100, Ciudad Ejemplo, Provincia', 150000.00, 3, 1, 100, 1, '2025-01-01', '2027-12-31', 'Seguro de Hogar', NULL, NULL, NULL, 1.00, NULL, 'Casa en excelente estado', NULL, NULL, 'casa', NULL, '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              (2, NULL, NULL, 2, 'Avenida Central 200', 'Departamento en zona céntrica', 'Avenida Central 200, Ciudad Ejemplo, Provincia', 150000.00, 2, 2, 90, 1, '2024-02-01', '2026-01-31', 'Seguro de Hogar', NULL, NULL, NULL, 1.00, NULL, 'Departamento en excelente estado', NULL, NULL, 'departamento', NULL, '2026-03-31 18:18:04', '2026-03-31 18:18:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_claims`
--

CREATE TABLE `property_claims` (
                                   `id` bigint UNSIGNED NOT NULL,
                                   `property_id` bigint UNSIGNED NOT NULL,
                                   `user_id` bigint UNSIGNED NOT NULL,
                                   `owner_id` bigint UNSIGNED NOT NULL,
                                   `tenant_id` bigint UNSIGNED DEFAULT NULL,
                                   `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
                                   `priority` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
                                   `resolution_notes` text COLLATE utf8mb4_unicode_ci,
                                   `resolved_at` timestamp NULL DEFAULT NULL,
                                   `created_at` timestamp NULL DEFAULT NULL,
                                   `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_claim_images`
--

CREATE TABLE `property_claim_images` (
                                         `id` bigint UNSIGNED NOT NULL,
                                         `property_claim_id` bigint UNSIGNED NOT NULL,
                                         `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                         `is_main` tinyint(1) NOT NULL DEFAULT '0',
                                         `created_at` timestamp NULL DEFAULT NULL,
                                         `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_claim_responses`
--

CREATE TABLE `property_claim_responses` (
                                            `id` bigint UNSIGNED NOT NULL,
                                            `property_claim_id` bigint UNSIGNED NOT NULL,
                                            `user_id` bigint UNSIGNED DEFAULT NULL,
                                            `owner_id` bigint UNSIGNED DEFAULT NULL,
                                            `tenant_id` bigint UNSIGNED DEFAULT NULL,
                                            `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
                                            `is_internal` tinyint(1) NOT NULL DEFAULT '0',
                                            `created_at` timestamp NULL DEFAULT NULL,
                                            `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_documents`
--

CREATE TABLE `property_documents` (
                                      `id` bigint UNSIGNED NOT NULL,
                                      `property_id` bigint UNSIGNED NOT NULL,
                                      `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      `created_at` timestamp NULL DEFAULT NULL,
                                      `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_expenses`
--

CREATE TABLE `property_expenses` (
                                     `id` bigint UNSIGNED NOT NULL,
                                     `property_id` bigint UNSIGNED NOT NULL,
                                     `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `amount` decimal(10,2) NOT NULL,
                                     `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `expense_date` date NOT NULL,
                                     `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `observations` text COLLATE utf8mb4_unicode_ci,
                                     `created_at` timestamp NULL DEFAULT NULL,
                                     `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_images`
--

CREATE TABLE `property_images` (
                                   `id` bigint UNSIGNED NOT NULL,
                                   `property_id` bigint UNSIGNED NOT NULL,
                                   `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `is_main` tinyint(1) NOT NULL DEFAULT '0',
                                   `created_at` timestamp NULL DEFAULT NULL,
                                   `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_owner`
--

CREATE TABLE `property_owner` (
                                  `id` bigint UNSIGNED NOT NULL,
                                  `property_id` bigint UNSIGNED NOT NULL,
                                  `owner_id` bigint UNSIGNED NOT NULL,
                                  `created_at` timestamp NULL DEFAULT NULL,
                                  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `property_owner`
--

INSERT INTO `property_owner` (`id`, `property_id`, `owner_id`, `created_at`, `updated_at`) VALUES
                                                                                               (1, 1, 1, NULL, NULL),
                                                                                               (2, 1, 2, NULL, NULL),
                                                                                               (3, 1, 3, NULL, NULL),
                                                                                               (4, 2, 1, NULL, NULL),
                                                                                               (5, 2, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_payments`
--

CREATE TABLE `property_payments` (
                                     `id` bigint UNSIGNED NOT NULL,
                                     `property_id` bigint UNSIGNED NOT NULL,
                                     `utility_id` bigint UNSIGNED NOT NULL,
                                     `owner_id` bigint UNSIGNED NOT NULL,
                                     `tenant_id` bigint UNSIGNED DEFAULT NULL,
                                     `concept` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `amount` decimal(10,2) NOT NULL,
                                     `amount_usd` decimal(10,2) DEFAULT NULL,
                                     `usd_rate` decimal(10,8) DEFAULT NULL,
                                     `amount_eur` decimal(10,2) DEFAULT NULL,
                                     `eur_rate` decimal(10,8) DEFAULT NULL,
                                     `amount_global66_eur` decimal(10,2) DEFAULT NULL,
                                     `global66_eur_rate` decimal(10,8) DEFAULT NULL,
                                     `external_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `metadata` json DEFAULT NULL,
                                     `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `payment_date` date NOT NULL,
                                     `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                     `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                     `observations` text COLLATE utf8mb4_unicode_ci,
                                     `created_at` timestamp NULL DEFAULT NULL,
                                     `updated_at` timestamp NULL DEFAULT NULL,
                                     `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_payment_documents`
--

CREATE TABLE `property_payment_documents` (
                                              `id` bigint UNSIGNED NOT NULL,
                                              `property_payment_id` bigint UNSIGNED NOT NULL,
                                              `document_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                              `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                              `created_at` timestamp NULL DEFAULT NULL,
                                              `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_tenant`
--

CREATE TABLE `property_tenant` (
                                   `id` bigint UNSIGNED NOT NULL,
                                   `property_id` bigint UNSIGNED NOT NULL,
                                   `tenant_id` bigint UNSIGNED NOT NULL,
                                   `created_at` timestamp NULL DEFAULT NULL,
                                   `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `property_tenant`
--

INSERT INTO `property_tenant` (`id`, `property_id`, `tenant_id`, `created_at`, `updated_at`) VALUES
                                                                                                 (1, 1, 1, NULL, NULL),
                                                                                                 (2, 1, 2, NULL, NULL),
                                                                                                 (3, 2, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_user`
--

CREATE TABLE `property_user` (
                                 `id` bigint UNSIGNED NOT NULL,
                                 `property_id` bigint UNSIGNED NOT NULL,
                                 `user_id` bigint UNSIGNED NOT NULL,
                                 `created_at` timestamp NULL DEFAULT NULL,
                                 `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `property_user`
--

INSERT INTO `property_user` (`id`, `property_id`, `user_id`, `created_at`, `updated_at`) VALUES
                                                                                             (1, 1, 1, NULL, NULL),
                                                                                             (2, 1, 2, NULL, NULL),
                                                                                             (3, 1, 3, NULL, NULL),
                                                                                             (4, 1, 6, NULL, NULL),
                                                                                             (5, 1, 7, NULL, NULL),
                                                                                             (6, 2, 1, NULL, NULL),
                                                                                             (7, 2, 2, NULL, NULL),
                                                                                             (8, 2, 8, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `property_utility`
--

CREATE TABLE `property_utility` (
                                    `id` bigint UNSIGNED NOT NULL,
                                    `property_id` bigint UNSIGNED NOT NULL,
                                    `utility_id` bigint UNSIGNED NOT NULL,
                                    `created_at` timestamp NULL DEFAULT NULL,
                                    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `property_utility`
--

INSERT INTO `property_utility` (`id`, `property_id`, `utility_id`, `created_at`, `updated_at`) VALUES
                                                                                                   (1, 1, 1, NULL, NULL),
                                                                                                   (2, 2, 1, NULL, NULL),
                                                                                                   (3, 1, 2, NULL, NULL),
                                                                                                   (4, 2, 2, NULL, NULL),
                                                                                                   (5, 1, 3, NULL, NULL),
                                                                                                   (6, 2, 3, NULL, NULL),
                                                                                                   (7, 1, 4, NULL, NULL),
                                                                                                   (8, 2, 4, NULL, NULL),
                                                                                                   (9, 1, 5, NULL, NULL),
                                                                                                   (10, 2, 5, NULL, NULL),
                                                                                                   (11, 1, 6, NULL, NULL),
                                                                                                   (12, 2, 6, NULL, NULL),
                                                                                                   (13, 1, 7, NULL, NULL),
                                                                                                   (14, 2, 7, NULL, NULL),
                                                                                                   (15, 1, 8, NULL, NULL),
                                                                                                   (16, 2, 8, NULL, NULL),
                                                                                                   (17, 1, 9, NULL, NULL),
                                                                                                   (18, 2, 9, NULL, NULL),
                                                                                                   (19, 1, 10, NULL, NULL),
                                                                                                   (20, 2, 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reviews`
--

CREATE TABLE `reviews` (
                           `id` bigint UNSIGNED NOT NULL,
                           `user_id` bigint UNSIGNED NOT NULL,
                           `property_id` bigint UNSIGNED DEFAULT NULL,
                           `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `usage_type` enum('owner','tenant') COLLATE utf8mb4_unicode_ci NOT NULL,
                           `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
                           `status` enum('pending','approved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
                           `rating` tinyint UNSIGNED NOT NULL DEFAULT '5',
                           `created_at` timestamp NULL DEFAULT NULL,
                           `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
                         `id` bigint UNSIGNED NOT NULL,
                         `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `created_at` timestamp NULL DEFAULT NULL,
                         `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
                                                                                 (1, 'admin', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                 (2, 'owner', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                 (3, 'agent', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01'),
                                                                                 (4, 'tenant', 'web', '2026-03-31 18:18:01', '2026-03-31 18:18:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
                                        `permission_id` bigint UNSIGNED NOT NULL,
                                        `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
                                                                    (1, 1),
                                                                    (2, 1),
                                                                    (3, 1),
                                                                    (4, 1),
                                                                    (5, 1),
                                                                    (6, 1),
                                                                    (7, 1),
                                                                    (8, 1),
                                                                    (9, 1),
                                                                    (10, 1),
                                                                    (11, 1),
                                                                    (12, 1),
                                                                    (1, 2),
                                                                    (2, 2),
                                                                    (3, 2),
                                                                    (5, 2),
                                                                    (6, 2),
                                                                    (7, 2),
                                                                    (8, 2),
                                                                    (9, 2),
                                                                    (10, 2),
                                                                    (11, 2),
                                                                    (1, 3),
                                                                    (2, 3),
                                                                    (3, 3),
                                                                    (5, 3),
                                                                    (6, 3),
                                                                    (7, 3),
                                                                    (8, 3),
                                                                    (9, 3),
                                                                    (10, 3),
                                                                    (11, 3),
                                                                    (12, 3),
                                                                    (2, 4),
                                                                    (7, 4),
                                                                    (9, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subscriptions`
--

CREATE TABLE `subscriptions` (
                                 `id` bigint UNSIGNED NOT NULL,
                                 `user_id` bigint UNSIGNED NOT NULL,
                                 `agency_id` bigint UNSIGNED DEFAULT NULL,
                                 `plan_id` bigint UNSIGNED NOT NULL,
                                 `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Payment provider, e.g. mercadopago, stripe',
                                 `provider_subscription_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                 `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'active, past_due, cancelled, trial',
                                 `billing_period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly' COMMENT 'monthly or annual',
                                 `monthly_price` bigint UNSIGNED NOT NULL DEFAULT '0',
                                 `annual_price` bigint UNSIGNED NOT NULL DEFAULT '0',
                                 `starts_at` timestamp NULL DEFAULT NULL,
                                 `ends_at` timestamp NULL DEFAULT NULL,
                                 `trial_ends_at` timestamp NULL DEFAULT NULL,
                                 `canceled_at` timestamp NULL DEFAULT NULL,
                                 `created_at` timestamp NULL DEFAULT NULL,
                                 `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `agency_id`, `plan_id`, `provider`, `provider_subscription_id`, `status`, `billing_period`, `monthly_price`, `annual_price`, `starts_at`, `ends_at`, `trial_ends_at`, `canceled_at`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                                                                                   (1, 4, NULL, 2, NULL, NULL, 'trial', 'monthly', 25000, 255000, '2026-03-31 18:18:03', NULL, '2026-04-14 18:18:03', NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                                                                                                                                                                   (2, 5, NULL, 2, NULL, NULL, 'trial', 'monthly', 25000, 255000, '2026-03-31 18:18:03', NULL, '2026-04-14 18:18:03', NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subscription_events`
--

CREATE TABLE `subscription_events` (
                                       `id` bigint UNSIGNED NOT NULL,
                                       `user_id` bigint UNSIGNED DEFAULT NULL,
                                       `subscription_id` bigint UNSIGNED DEFAULT NULL,
                                       `previous_subscription_id` bigint UNSIGNED DEFAULT NULL,
                                       `from_plan_id` bigint UNSIGNED DEFAULT NULL,
                                       `to_plan_id` bigint UNSIGNED DEFAULT NULL,
                                       `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                       `metadata` json DEFAULT NULL,
                                       `created_at` timestamp NULL DEFAULT NULL,
                                       `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subscription_payments`
--

CREATE TABLE `subscription_payments` (
                                         `id` bigint UNSIGNED NOT NULL,
                                         `user_id` bigint UNSIGNED DEFAULT NULL,
                                         `agency_id` bigint UNSIGNED DEFAULT NULL,
                                         `plan_id` bigint UNSIGNED DEFAULT NULL,
                                         `preference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                         `init_point` text COLLATE utf8mb4_unicode_ci,
                                         `public_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                         `amount` decimal(12,2) DEFAULT NULL,
                                         `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ARS',
                                         `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'created',
                                         `metadata` json DEFAULT NULL,
                                         `created_at` timestamp NULL DEFAULT NULL,
                                         `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tenants`
--

CREATE TABLE `tenants` (
                           `id` bigint UNSIGNED NOT NULL,
                           `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `dni` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `birthdate` date NOT NULL,
                           `observations` text COLLATE utf8mb4_unicode_ci,
                           `user_id` bigint UNSIGNED DEFAULT NULL,
                           `created_at` timestamp NULL DEFAULT NULL,
                           `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tenants`
--

INSERT INTO `tenants` (`id`, `name`, `phone`, `dni`, `birthdate`, `observations`, `user_id`, `created_at`, `updated_at`) VALUES
                                                                                                                             (1, 'Ana González', '+34600000011', '11111111', '1985-03-15', '', 6, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                             (2, 'Pedro Rodríguez', '+34600000012', '22222222', '1990-07-22', '', 7, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                             (3, 'Juan Fernández', '+34600000013', '33333333', '1992-11-08', '', 8, '2026-03-31 18:18:03', '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
                         `id` bigint UNSIGNED NOT NULL,
                         `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `email_verified_at` timestamp NULL DEFAULT NULL,
                         `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `password_changed_at` timestamp NULL DEFAULT NULL,
                         `settings` json DEFAULT NULL,
                         `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `receive_notifications` tinyint(1) NOT NULL DEFAULT '1',
                         `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `created_at` timestamp NULL DEFAULT NULL,
                         `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `password_changed_at`, `settings`, `provider`, `receive_notifications`, `remember_token`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                       (1, 'Admin Usuario', 'admin@example.com', '2026-03-01 20:19:08', '$2y$10$gN2tMNABTP.1SQ9sZFejqe55UXwXCAaE2fMThCsMukLWPV8HK/j26', '2026-03-31 18:20:05', NULL, NULL, 1, NULL, '2026-03-31 18:18:01', '2026-03-31 18:20:05'),
                                                                                                                                                                                                       (2, 'María López', 'owner1@example.com', '2026-03-02 20:19:13', '$2y$10$t5UQ8GvxmyRsHXxeoNpGeOckIkdrRMhC/5alC6QwdmuHngdmZUlkG', NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                       (3, 'Laura Martínez', 'owner2@example.com', NULL, '$2y$10$ocu0qBtxaw0f6bv3qY3i5umP5HU32i2P2yJOPdZcJ8YXuCBX52AfK', NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                       (4, 'Acme Owner', 'acme.owner@example.com', '2026-03-10 20:19:22', '$2y$10$hMSbp/kN1wl9uuDxiVXKWuwFUBAKCMnhVjBr7gAKB54CKly9zbMJW', '2026-03-31 18:18:02', NULL, NULL, 1, NULL, '2026-03-31 18:18:02', '2026-03-31 18:18:02'),
                                                                                                                                                                                                       (5, 'Best Owner', 'best.owner@example.com', NULL, '$2y$10$Tlrd6GlK06eEUKfnOpZ5NOhxS4W6LOZQg/9Nw20WgCm0SHBpFAlDu', '2026-03-31 18:18:03', NULL, NULL, 1, NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                                                                                                       (6, 'Ana González', 'tenant1@example.com', NULL, '$2y$10$uL4dU6AMYeA6iADXM7t0DuAkluQBRiOH4VN/sCzbh9EOenwPQMztS', NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                                                                                                       (7, 'Pedro Rodríguez', 'tenant2@example.com', '2026-03-11 20:19:27', '$2y$10$lUbqc4w6/6/fwKfrpuSNT.La1g2cSEWl0a3ICxMU1iTf8TOp3Yoc2', NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03'),
                                                                                                                                                                                                       (8, 'Juan Fernández', 'tenant3@example.com', NULL, '$2y$10$xl3wRvRwHGvAHXuJkEH1fOUDj2eARjIk58cokZOLpVL9rpmKtEDXe', NULL, NULL, NULL, 1, NULL, '2026-03-31 18:18:03', '2026-03-31 18:18:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `utilities`
--

CREATE TABLE `utilities` (
                             `id` bigint UNSIGNED NOT NULL,
                             `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `holder` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `access_user` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `access_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `observations` text COLLATE utf8mb4_unicode_ci,
                             `created_at` timestamp NULL DEFAULT NULL,
                             `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `utilities`
--

INSERT INTO `utilities` (`id`, `name`, `type`, `holder`, `operator`, `number`, `address`, `email`, `phone`, `url`, `access_user`, `access_password`, `observations`, `created_at`, `updated_at`) VALUES
                                                                                                                                                                                                     (1, 'Alquiler', 'Ingreso', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (2, 'Electricidad', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (3, 'Agua', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (4, 'Gas', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (5, 'Internet', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (6, 'Expensa', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (7, 'Impuesto', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (8, 'Incidencia', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (9, 'Depósito', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (10, 'Descuento', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (11, 'Alquiler', 'Ingreso', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (12, 'Electricidad', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (13, 'Agua', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (14, 'Gas', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (15, 'Internet', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (16, 'Expensa', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (17, 'Impuesto', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (18, 'Incidencia', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (19, 'Depósito', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04'),
                                                                                                                                                                                                     (20, 'Descuento', 'Gasto', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '', '2026-03-31 18:18:04', '2026-03-31 18:18:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `utility_types`
--

CREATE TABLE `utility_types` (
                                 `id` bigint UNSIGNED NOT NULL,
                                 `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `created_at` timestamp NULL DEFAULT NULL,
                                 `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `access_logs`
--
ALTER TABLE `access_logs`
    ADD PRIMARY KEY (`id`),
  ADD KEY `access_logs_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `agencies`
--
ALTER TABLE `agencies`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agencies_slug_unique` (`slug`),
  ADD KEY `agencies_plan_id_foreign` (`plan_id`);

--
-- Indices de la tabla `agency_user`
--
ALTER TABLE `agency_user`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agency_user_agency_id_user_id_unique` (`agency_id`,`user_id`),
  ADD KEY `agency_user_user_id_foreign` (`user_id`),
  ADD KEY `agency_user_invited_by_id_foreign` (`invited_by_id`),
  ADD KEY `agency_user_accepted_by_id_foreign` (`accepted_by_id`),
  ADD KEY `agency_user_created_by_id_foreign` (`created_by_id`);

--
-- Indices de la tabla `deposits`
--
ALTER TABLE `deposits`
    ADD PRIMARY KEY (`id`),
  ADD KEY `deposits_property_id_foreign` (`property_id`),
  ADD KEY `deposits_tenant_id_foreign` (`tenant_id`),
  ADD KEY `deposits_processed_by_foreign` (`processed_by`);

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
    ADD PRIMARY KEY (`id`),
  ADD KEY `events_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `mercadopago_payment_maps`
--
ALTER TABLE `mercadopago_payment_maps`
    ADD PRIMARY KEY (`id`),
  ADD KEY `mercadopago_payment_maps_preference_id_index` (`preference_id`),
  ADD KEY `mercadopago_payment_maps_payment_id_index` (`payment_id`),
  ADD KEY `mercadopago_payment_maps_owner_id_index` (`owner_id`),
  ADD KEY `mercadopago_payment_maps_property_id_index` (`property_id`),
  ADD KEY `mercadopago_payment_maps_tenant_id_index` (`tenant_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
    ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indices de la tabla `model_has_roles`
--
ALTER TABLE `model_has_roles`
    ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
    ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indices de la tabla `owners`
--
ALTER TABLE `owners`
    ADD PRIMARY KEY (`id`),
  ADD KEY `owners_user_id_foreign` (`user_id`),
  ADD KEY `owners_created_by_id_index` (`created_by_id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
    ADD KEY `password_resets_email_index` (`email`);

--
-- Indices de la tabla `pending_rent_increments`
--
ALTER TABLE `pending_rent_increments`
    ADD PRIMARY KEY (`id`),
  ADD KEY `pending_rent_increments_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `plans`
--
ALTER TABLE `plans`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plans_slug_unique` (`slug`);

--
-- Indices de la tabla `price_indices`
--
ALTER TABLE `price_indices`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `properties`
--
ALTER TABLE `properties`
    ADD PRIMARY KEY (`id`),
  ADD KEY `properties_designated_owner_id_foreign` (`designated_owner_id`),
  ADD KEY `properties_agency_id_foreign` (`agency_id`),
  ADD KEY `properties_managed_by_user_id_foreign` (`managed_by_user_id`);

--
-- Indices de la tabla `property_claims`
--
ALTER TABLE `property_claims`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_claims_property_id_foreign` (`property_id`),
  ADD KEY `property_claims_user_id_foreign` (`user_id`),
  ADD KEY `property_claims_owner_id_foreign` (`owner_id`),
  ADD KEY `property_claims_tenant_id_foreign` (`tenant_id`);

--
-- Indices de la tabla `property_claim_images`
--
ALTER TABLE `property_claim_images`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_claim_images_property_claim_id_foreign` (`property_claim_id`);

--
-- Indices de la tabla `property_claim_responses`
--
ALTER TABLE `property_claim_responses`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_claim_responses_property_claim_id_foreign` (`property_claim_id`),
  ADD KEY `property_claim_responses_user_id_foreign` (`user_id`),
  ADD KEY `property_claim_responses_owner_id_foreign` (`owner_id`),
  ADD KEY `property_claim_responses_tenant_id_foreign` (`tenant_id`);

--
-- Indices de la tabla `property_documents`
--
ALTER TABLE `property_documents`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_documents_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `property_expenses`
--
ALTER TABLE `property_expenses`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_expenses_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `property_images`
--
ALTER TABLE `property_images`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_images_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `property_owner`
--
ALTER TABLE `property_owner`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_owner_property_id_foreign` (`property_id`),
  ADD KEY `property_owner_owner_id_foreign` (`owner_id`);

--
-- Indices de la tabla `property_payments`
--
ALTER TABLE `property_payments`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_payments_external_id_unique` (`external_id`),
  ADD KEY `property_payments_property_id_foreign` (`property_id`),
  ADD KEY `property_payments_utility_id_foreign` (`utility_id`),
  ADD KEY `property_payments_owner_id_foreign` (`owner_id`);

--
-- Indices de la tabla `property_payment_documents`
--
ALTER TABLE `property_payment_documents`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_payment_documents_property_payment_id_foreign` (`property_payment_id`);

--
-- Indices de la tabla `property_tenant`
--
ALTER TABLE `property_tenant`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_tenant_property_id_foreign` (`property_id`),
  ADD KEY `property_tenant_tenant_id_foreign` (`tenant_id`);

--
-- Indices de la tabla `property_user`
--
ALTER TABLE `property_user`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_user_property_id_foreign` (`property_id`),
  ADD KEY `property_user_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `property_utility`
--
ALTER TABLE `property_utility`
    ADD PRIMARY KEY (`id`),
  ADD KEY `property_utility_property_id_foreign` (`property_id`),
  ADD KEY `property_utility_utility_id_foreign` (`utility_id`);

--
-- Indices de la tabla `reviews`
--
ALTER TABLE `reviews`
    ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`),
  ADD KEY `reviews_property_id_foreign` (`property_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indices de la tabla `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
    ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indices de la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
    ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_status_billing_period_index` (`status`,`billing_period`),
  ADD KEY `subscriptions_user_id_index` (`user_id`),
  ADD KEY `subscriptions_plan_id_index` (`plan_id`),
  ADD KEY `subscriptions_agency_id_foreign` (`agency_id`);

--
-- Indices de la tabla `subscription_events`
--
ALTER TABLE `subscription_events`
    ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_events_user_id_index` (`user_id`),
  ADD KEY `subscription_events_subscription_id_index` (`subscription_id`),
  ADD KEY `subscription_events_previous_subscription_id_index` (`previous_subscription_id`),
  ADD KEY `subscription_events_from_plan_id_index` (`from_plan_id`),
  ADD KEY `subscription_events_to_plan_id_index` (`to_plan_id`);

--
-- Indices de la tabla `subscription_payments`
--
ALTER TABLE `subscription_payments`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_payments_preference_id_unique` (`preference_id`),
  ADD KEY `subscription_payments_user_id_index` (`user_id`),
  ADD KEY `subscription_payments_plan_id_index` (`plan_id`),
  ADD KEY `subscription_payments_status_index` (`status`),
  ADD KEY `subscription_payments_agency_id_foreign` (`agency_id`);

--
-- Indices de la tabla `tenants`
--
ALTER TABLE `tenants`
    ADD PRIMARY KEY (`id`),
  ADD KEY `tenants_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `utilities`
--
ALTER TABLE `utilities`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `utility_types`
--
ALTER TABLE `utility_types`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utility_types_name_unique` (`name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `access_logs`
--
ALTER TABLE `access_logs`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `agencies`
--
ALTER TABLE `agencies`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `agency_user`
--
ALTER TABLE `agency_user`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `deposits`
--
ALTER TABLE `deposits`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mercadopago_payment_maps`
--
ALTER TABLE `mercadopago_payment_maps`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
    MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `owners`
--
ALTER TABLE `owners`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pending_rent_increments`
--
ALTER TABLE `pending_rent_increments`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `plans`
--
ALTER TABLE `plans`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `price_indices`
--
ALTER TABLE `price_indices`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `property_claims`
--
ALTER TABLE `property_claims`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_claim_images`
--
ALTER TABLE `property_claim_images`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_claim_responses`
--
ALTER TABLE `property_claim_responses`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_documents`
--
ALTER TABLE `property_documents`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_expenses`
--
ALTER TABLE `property_expenses`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_images`
--
ALTER TABLE `property_images`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_owner`
--
ALTER TABLE `property_owner`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `property_payments`
--
ALTER TABLE `property_payments`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_payment_documents`
--
ALTER TABLE `property_payment_documents`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `property_tenant`
--
ALTER TABLE `property_tenant`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `property_user`
--
ALTER TABLE `property_user`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `property_utility`
--
ALTER TABLE `property_utility`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `reviews`
--
ALTER TABLE `reviews`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `subscription_events`
--
ALTER TABLE `subscription_events`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `subscription_payments`
--
ALTER TABLE `subscription_payments`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tenants`
--
ALTER TABLE `tenants`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `utilities`
--
ALTER TABLE `utilities`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `utility_types`
--
ALTER TABLE `utility_types`
    MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `access_logs`
--
ALTER TABLE `access_logs`
    ADD CONSTRAINT `access_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `agencies`
--
ALTER TABLE `agencies`
    ADD CONSTRAINT `agencies_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `agency_user`
--
ALTER TABLE `agency_user`
    ADD CONSTRAINT `agency_user_accepted_by_id_foreign` FOREIGN KEY (`accepted_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `agency_user_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `agency_user_created_by_id_foreign` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `agency_user_invited_by_id_foreign` FOREIGN KEY (`invited_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `agency_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `deposits`
--
ALTER TABLE `deposits`
    ADD CONSTRAINT `deposits_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `deposits_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deposits_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `events`
--
ALTER TABLE `events`
    ADD CONSTRAINT `events_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
    ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `model_has_roles`
--
ALTER TABLE `model_has_roles`
    ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `owners`
--
ALTER TABLE `owners`
    ADD CONSTRAINT `owners_created_by_id_foreign` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `owners_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pending_rent_increments`
--
ALTER TABLE `pending_rent_increments`
    ADD CONSTRAINT `pending_rent_increments_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`);

--
-- Filtros para la tabla `properties`
--
ALTER TABLE `properties`
    ADD CONSTRAINT `properties_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `properties_designated_owner_id_foreign` FOREIGN KEY (`designated_owner_id`) REFERENCES `owners` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `properties_managed_by_user_id_foreign` FOREIGN KEY (`managed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `property_claims`
--
ALTER TABLE `property_claims`
    ADD CONSTRAINT `property_claims_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `property_claims_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `property_claims_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `property_claims_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `property_claim_images`
--
ALTER TABLE `property_claim_images`
    ADD CONSTRAINT `property_claim_images_property_claim_id_foreign` FOREIGN KEY (`property_claim_id`) REFERENCES `property_claims` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_claim_responses`
--
ALTER TABLE `property_claim_responses`
    ADD CONSTRAINT `property_claim_responses_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `property_claim_responses_property_claim_id_foreign` FOREIGN KEY (`property_claim_id`) REFERENCES `property_claims` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_claim_responses_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `property_claim_responses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `property_documents`
--
ALTER TABLE `property_documents`
    ADD CONSTRAINT `property_documents_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `property_expenses`
--
ALTER TABLE `property_expenses`
    ADD CONSTRAINT `property_expenses_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_images`
--
ALTER TABLE `property_images`
    ADD CONSTRAINT `property_images_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `property_owner`
--
ALTER TABLE `property_owner`
    ADD CONSTRAINT `property_owner_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_owner_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_payments`
--
ALTER TABLE `property_payments`
    ADD CONSTRAINT `property_payments_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_payments_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_payments_utility_id_foreign` FOREIGN KEY (`utility_id`) REFERENCES `utilities` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_payment_documents`
--
ALTER TABLE `property_payment_documents`
    ADD CONSTRAINT `property_payment_documents_property_payment_id_foreign` FOREIGN KEY (`property_payment_id`) REFERENCES `property_payments` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_tenant`
--
ALTER TABLE `property_tenant`
    ADD CONSTRAINT `property_tenant_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_tenant_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_user`
--
ALTER TABLE `property_user`
    ADD CONSTRAINT `property_user_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `property_utility`
--
ALTER TABLE `property_utility`
    ADD CONSTRAINT `property_utility_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_utility_utility_id_foreign` FOREIGN KEY (`utility_id`) REFERENCES `utilities` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reviews`
--
ALTER TABLE `reviews`
    ADD CONSTRAINT `reviews_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
    ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
    ADD CONSTRAINT `subscriptions_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `subscription_payments`
--
ALTER TABLE `subscription_payments`
    ADD CONSTRAINT `subscription_payments_agency_id_foreign` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `tenants`
--
ALTER TABLE `tenants`
    ADD CONSTRAINT `tenants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;