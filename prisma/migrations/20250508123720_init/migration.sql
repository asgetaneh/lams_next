-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NULL,
    `ldap_identifier` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_ldap_identifier_key`(`ldap_identifier`),
    INDEX `Users_email_username_idx`(`email`, `username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `role_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Roles_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `permission_id` VARCHAR(191) NOT NULL,
    `permission_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Permissions_permission_name_key`(`permission_name`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role_Permissions` (
    `role_id` VARCHAR(191) NOT NULL,
    `permission_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Roles` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offices` (
    `office_id` VARCHAR(191) NOT NULL,
    `office_name` VARCHAR(191) NOT NULL,
    `parent_office_id` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Offices_parent_office_id_idx`(`parent_office_id`),
    PRIMARY KEY (`office_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Letter_Types` (
    `letter_type_id` VARCHAR(191) NOT NULL,
    `type_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Letter_Types_type_name_key`(`type_name`),
    PRIMARY KEY (`letter_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Templates` (
    `template_id` VARCHAR(191) NOT NULL,
    `letter_type_id` VARCHAR(191) NOT NULL,
    `template_name` VARCHAR(191) NOT NULL,
    `html_content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Templates_letter_type_id_idx`(`letter_type_id`),
    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Letters` (
    `letter_id` VARCHAR(191) NOT NULL,
    `letter_type_id` VARCHAR(191) NOT NULL,
    `template_id` VARCHAR(191) NULL,
    `creator_id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Letters_creator_id_status_created_at_idx`(`creator_id`, `status`, `created_at`),
    PRIMARY KEY (`letter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Letter_Recipients` (
    `letter_recipient_id` VARCHAR(191) NOT NULL,
    `letter_id` VARCHAR(191) NOT NULL,
    `recipient_type` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `office_id` VARCHAR(191) NULL,
    `is_primary_recipient` BOOLEAN NOT NULL DEFAULT false,
    `is_cc` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Letter_Recipients_letter_id_user_id_office_id_idx`(`letter_id`, `user_id`, `office_id`),
    PRIMARY KEY (`letter_recipient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Letter_Workflow` (
    `workflow_id` VARCHAR(191) NOT NULL,
    `letter_id` VARCHAR(191) NOT NULL,
    `from_user_id` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NULL,
    `to_office_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NULL,
    `is_signed` BOOLEAN NOT NULL DEFAULT false,
    `signature_data` LONGBLOB NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Letter_Workflow_letter_id_from_user_id_to_user_id_to_office__idx`(`letter_id`, `from_user_id`, `to_user_id`, `to_office_id`, `created_at`),
    PRIMARY KEY (`workflow_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scanned_Documents` (
    `scan_id` VARCHAR(191) NOT NULL,
    `letter_id` VARCHAR(191) NULL,
    `scan_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `scanned_by` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Scanned_Documents_letter_id_scanned_by_idx`(`letter_id`, `scanned_by`),
    PRIMARY KEY (`scan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Archives` (
    `archive_id` VARCHAR(191) NOT NULL,
    `letter_id` VARCHAR(191) NOT NULL,
    `archived_by` VARCHAR(191) NOT NULL,
    `archive_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `retention_period` INTEGER NOT NULL,
    `classification_level` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Archives_letter_id_key`(`letter_id`),
    PRIMARY KEY (`archive_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role_Permissions` ADD CONSTRAINT `Role_Permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role_Permissions` ADD CONSTRAINT `Role_Permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`permission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Roles` ADD CONSTRAINT `User_Roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offices` ADD CONSTRAINT `Offices_parent_office_id_fkey` FOREIGN KEY (`parent_office_id`) REFERENCES `Offices`(`office_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Templates` ADD CONSTRAINT `Templates_letter_type_id_fkey` FOREIGN KEY (`letter_type_id`) REFERENCES `Letter_Types`(`letter_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letters` ADD CONSTRAINT `Letters_letter_type_id_fkey` FOREIGN KEY (`letter_type_id`) REFERENCES `Letter_Types`(`letter_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letters` ADD CONSTRAINT `Letters_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `Templates`(`template_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letters` ADD CONSTRAINT `Letters_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Recipients` ADD CONSTRAINT `Letter_Recipients_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `Letters`(`letter_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Recipients` ADD CONSTRAINT `Letter_Recipients_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Recipients` ADD CONSTRAINT `Letter_Recipients_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `Offices`(`office_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Workflow` ADD CONSTRAINT `Letter_Workflow_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `Letters`(`letter_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Workflow` ADD CONSTRAINT `Letter_Workflow_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Workflow` ADD CONSTRAINT `Letter_Workflow_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Letter_Workflow` ADD CONSTRAINT `Letter_Workflow_to_office_id_fkey` FOREIGN KEY (`to_office_id`) REFERENCES `Offices`(`office_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scanned_Documents` ADD CONSTRAINT `Scanned_Documents_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `Letters`(`letter_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scanned_Documents` ADD CONSTRAINT `Scanned_Documents_scanned_by_fkey` FOREIGN KEY (`scanned_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Archives` ADD CONSTRAINT `Archives_letter_id_fkey` FOREIGN KEY (`letter_id`) REFERENCES `Letters`(`letter_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Archives` ADD CONSTRAINT `Archives_archived_by_fkey` FOREIGN KEY (`archived_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
