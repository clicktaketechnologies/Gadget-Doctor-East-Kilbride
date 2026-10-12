"use client";

import { useState } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { useCreateService, useUpdateService } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES } from "@/lib/brand";
import { ICON_NAMES, Icon } from "@/components/icon";
import type { Service, ServiceCategory } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFormDialogProps {
  service: Service | null; // null = create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceFormDialog({
  service,
  open,
  onOpenChange,
}: ServiceFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={service?.id ?? "new"}
        className="glass-strong max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <ServiceFormBody
          service={service}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ServiceFormBody({
  service,
  onDone,
}: {
  service: Service | null;
  onDone: () => void;
}) {
  const isEdit = !!service;
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(service?.id ?? "");

  const [name, setName] = useState(service?.name ?? "");
  const [category, setCategory] = useState<ServiceCategory>(
    (service?.category as ServiceCategory) ?? "mobile"
  );
  const [description, setDescription] = useState(service?.description ?? "");
  const [icon, setIcon] = useState(service?.icon ?? "Smartphone");
  const [priceFrom, setPriceFrom] = useState<string>(
    service ? String(service.priceFrom / 100) : ""
  );
  const [priceTo, setPriceTo] = useState<string>(
    service ? String(service.priceTo / 100) : ""
  );
  const [turnaround, setTurnaround] = useState(service?.turnaround ?? "");
  const [popular, setPopular] = useState(service?.popular ?? false);

  const mutation = isEdit ? updateMutation : createMutation;
  const error = mutation.error?.message;

  const canSubmit =
    name.trim() !== "" &&
    description.trim() !== "" &&
    priceFrom !== "" &&
    priceTo !== "" &&
    turnaround.trim() !== "" &&
    !mutation.isPending;

  const handleSubmit = () => {
    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      icon,
      priceFrom: Math.round(Number(priceFrom) * 100),
      priceTo: Math.round(Number(priceTo) * 100),
      turnaround: turnaround.trim(),
      popular,
    };
    if (isEdit) {
      updateMutation.mutate(payload, { onSuccess: onDone });
    } else {
      createMutation.mutate(payload, { onSuccess: onDone });
    }
  };

  return (
    <>
      <DialogHeader className="border-b border-border/60 p-5 pr-12">
        <DialogTitle>{isEdit ? "Edit service" : "Add new service"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details for this repair service."
            : "Create a new repair service for your catalog."}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(92vh-200px)] space-y-4 overflow-y-auto custom-scroll p-5">
        {/* Name + icon preview */}
        <div className="flex items-end gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Icon name={icon} className="size-6" />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="sf-name">Service name</Label>
            <Input
              id="sf-name"
              placeholder="e.g. iPhone Screen Replacement"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sf-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ServiceCategory)}
            >
              <SelectTrigger id="sf-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sf-icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="sf-icon" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {ICON_NAMES.map((n) => (
                  <SelectItem key={n} value={n}>
                    <span className="flex items-center gap-2">
                      <Icon name={n} className="size-4" />
                      {n}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sf-description">Description</Label>
          <Textarea
            id="sf-description"
            rows={3}
            placeholder="What does this service include?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sf-price-from">Price from (£)</Label>
            <Input
              id="sf-price-from"
              type="number"
              min="0"
              step="0.01"
              placeholder="49.00"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sf-price-to">Price to (£)</Label>
            <Input
              id="sf-price-to"
              type="number"
              min="0"
              step="0.01"
              placeholder="89.00"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sf-turnaround">Turnaround</Label>
            <Input
              id="sf-turnaround"
              placeholder="30–60 mins"
              value={turnaround}
              onChange={(e) => setTurnaround(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3">
          <div>
            <div className="text-sm font-medium text-foreground">Mark as popular</div>
            <div className="text-xs text-muted-foreground">
              Featured prominently on the public site.
            </div>
          </div>
          <Switch checked={popular} onCheckedChange={setPopular} aria-label="Mark as popular" />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <DialogFooter className="border-t border-border/60 bg-secondary/20 p-4">
        <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isEdit ? "Save changes" : "Create service"}
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export default ServiceFormDialog;
