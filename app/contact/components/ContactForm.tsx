"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { submitContactForm } from "@/actions/contact";
import prompts from "@/prompts/prompts";

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitted: false,
    loading: false,
    error: "",
  });

  // Determine if form should be disabled
  const isFormDisabled = status.loading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: "" });

    try {
      // Call the server action
      const result = await submitContactForm(formState);

      if (result.success) {
        setFormState({ name: "", email: "", subject: "", message: "" });
        setStatus({ submitted: true, loading: false, error: "" });
      } else {
        setStatus({
          submitted: false,
          loading: false,
          error: result.message || prompts.contactUs.form.error.generic,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        submitted: false,
        loading: false,
        error: prompts.contactUs.form.error.unexpected,
      });
    }
  };

  return (
    <Card className="shadow-lg">
      {!status.submitted && (
        <CardHeader>
          <CardTitle>{prompts.contactUs.form.title}</CardTitle>
          <CardDescription>
            {prompts.contactUs.form.description}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {status.submitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <div className="bg-green-100 rounded-full p-3">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">
              {prompts.contactUs.form.success.title}
            </h3>
            <p className="text-gray-600">
              {prompts.contactUs.form.success.message}
            </p>
            <Button
              variant="outline"
              onClick={() => setStatus({ ...status, submitted: false })}
            >
              {prompts.contactUs.form.success.button}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {status.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{prompts.contactUs.form.nameLabel}</Label>
              <Input
                id="name"
                name="name"
                placeholder={prompts.contactUs.form.namePlaceholder}
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{prompts.contactUs.form.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={prompts.contactUs.form.emailPlaceholder}
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                disabled={isFormDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                {prompts.contactUs.form.subjectLabel}
              </Label>
              <Select
                name="subject"
                value={formState.subject}
                onValueChange={(value) =>
                  setFormState({ ...formState, subject: value })
                }
                required
                disabled={isFormDisabled}
              >
                <SelectTrigger id="subject">
                  <SelectValue
                    placeholder={prompts.contactUs.form.subjectPlaceholder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    {prompts.contactUs.form.subjects.general}
                  </SelectItem>
                  <SelectItem value="feedback">
                    {prompts.contactUs.form.subjects.feedback}
                  </SelectItem>
                  <SelectItem value="issue">
                    {prompts.contactUs.form.subjects.issue}
                  </SelectItem>
                  <SelectItem value="other">
                    {prompts.contactUs.form.subjects.other}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                {prompts.contactUs.form.messageLabel}
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={prompts.contactUs.form.messagePlaceholder}
                rows={5}
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                disabled={isFormDisabled}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {status.loading
                ? prompts.contactUs.form.sendingButton
                : prompts.contactUs.form.sendButton}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
