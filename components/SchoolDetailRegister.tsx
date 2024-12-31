'use client';

import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Constants for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SCHOOL_NAME_LENGTH = 100;

interface ValidationError {
  field: string;
  message: string;
}

interface SchoolDetailRegisterProps {
  onSuccess?: () => void;
}

function SchoolDetailRegister({ onSuccess }: SchoolDetailRegisterProps) {
  const [schoolName, setSchoolName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Validate file
  const validateFile = (file: File, fieldName: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (file.size > MAX_FILE_SIZE) {
      errors.push({
        field: fieldName,
        message: `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push({
        field: fieldName,
        message: `File type should be one of: ${ALLOWED_FILE_TYPES.join(", ")}`,
      });
    }
    return errors;
  };

  // Validate form data
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!schoolName.trim()) {
      errors.push({ field: "schoolName", message: "School name is required" });
    }
    if (schoolName.length > MAX_SCHOOL_NAME_LENGTH) {
      errors.push({
        field: "schoolName",
        message: `School name must be less than ${MAX_SCHOOL_NAME_LENGTH} characters`,
      });
    }
    if (!slug.trim()) {
      errors.push({ field: "slug", message: "Slug is required" });
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      errors.push({
        field: "slug",
        message: "Slug must contain only lowercase letters, numbers, and hyphens",
      });
    }
    if (!description.trim()) {
      errors.push({ field: "description", message: "Description is required" });
    }
    if (!logoFile) {
      errors.push({ field: "logo", message: "Logo is required" });
    }
    if (!bannerFile) {
      errors.push({ field: "banner", message: "Banner is required" });
    }
    if (logoFile) {
      errors.push(...validateFile(logoFile, "logo"));
    }
    if (bannerFile) {
      errors.push(...validateFile(bannerFile, "banner"));
    }
    return errors;
  };

  // Handle file upload
  const handleFileUpload = async (file: File, fileType: "logo" | "banner") => {
    if (!file) return null;
    const fileName = `${fileType}-${Date.now()}-${file.name.toLowerCase()}`;
    try {
      const { data, error } = await supabase.storage
        .from("school-media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) throw error;
      return data?.path;
    } catch (error: any) {
      console.error(`Error uploading ${fileType}:`, error.message);
      throw new Error(`Failed to upload ${fileType}: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMessage(null);
    setErrors([]);

    try {
      // Check for existing slug
      const { data: existingSchool } = await supabase
        .from("schools")
        .select("slug")
        .eq("slug", slug)
        .single();

      if (existingSchool) {
        throw new Error("A school with this slug already exists");
      }

      // Upload files
      const [logoPath, bannerPath] = await Promise.all([
        handleFileUpload(logoFile!, "logo"),
        handleFileUpload(bannerFile!, "banner"),
      ]);

      // Insert school details
      const { error: insertError } = await supabase.from("schools").insert([
        {
          name: schoolName.trim(),
          slug: slug.trim(),
          description: description.trim(),
          logo_url: logoPath,
          banner_url: bannerPath,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("School created successfully!");
      if (onSuccess) {
        setTimeout(onSuccess, 1000); // Call success callback after short delay
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred while creating the school");
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from school name
  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSchoolName(name);
    if (!slug) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Insert School Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="school_name" className="block text-sm font-medium mb-1">
            School Name:
          </label>
          <Input
            id="school_name"
            placeholder="Enter School Name"
            value={schoolName}
            onChange={handleSchoolNameChange}
            maxLength={MAX_SCHOOL_NAME_LENGTH}
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug:
          </label>
          <Input
            id="slug"
            placeholder="Enter School Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
          />
          <p className="text-sm text-gray-500 mt-1">
            URL-friendly identifier (letters, numbers, and hyphens only)
          </p>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description:
          </label>
          <textarea
            id="description"
            placeholder="Enter School Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-1">
            Logo:
          </label>
          <Input
            type="file"
            id="logo"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Max size: 5MB. Allowed types: JPEG, PNG, WebP
          </p>
        </div>
        <div>
          <label htmlFor="banner" className="block text-sm font-medium mb-1">
            Banner:
          </label>
          <Input
            type="file"
            id="banner"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={(e) => setBannerFile(e.target.files ? e.target.files[0] : null)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Max size: 5MB. Allowed types: JPEG, PNG, WebP
          </p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert
          variant={message.includes("successfully") ? "default" : "destructive"}
          className="mt-4"
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default SchoolDetailRegister;
