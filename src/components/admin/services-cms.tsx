"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { useServices, useUpdateService, useDeleteService } from "@/lib/api-hooks";
import { SERVICE_CATEGORIES } from "@/lib/brand";
import { Icon } from "@/components/icon";
import { formatPriceRange } from "@/lib/format";
import type { Service } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ServiceFormDialog } from "./service-form-dialog";

function categoryLabel(value: string): string {
  return SERVICE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function ServicesCMS() {
  const servicesQ = useServices();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (s: Service) => {
    setEditing(s);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Service Catalog</h2>
          <p className="text-sm text-muted-foreground">
            {servicesQ.isLoading
              ? "Loading…"
              : `${servicesQ.data?.length ?? 0} services configured`}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {/* Table */}
      <Card className="glass p-0">
        <div className="overflow-x-auto custom-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price range</TableHead>
                <TableHead>Turnaround</TableHead>
                <TableHead className="text-center">Popular</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesQ.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : ""}>
                        <Skeleton className="h-5 w-full max-w-[140px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (servicesQ.data ?? []).length === 0 ? (
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell colSpan={7} className="h-40 text-center text-sm text-muted-foreground">
                    No services yet. Click “Add Service” to create one.
                  </TableCell>
                </TableRow>
              ) : (
                (servicesQ.data ?? []).map((s) => (
                  <ServiceRow key={s.id} service={s} onEdit={openEdit} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ServiceFormDialog
        service={editing}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}

function ServiceRow({
  service,
  onEdit,
}: {
  service: Service;
  onEdit: (s: Service) => void;
}) {
  return (
    <TableRow className="border-border/60">
      <TableCell className="pl-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon name={service.icon} className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">
              {service.name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {service.slug}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="border-border/60 text-muted-foreground">
          {categoryLabel(service.category)}
        </Badge>
      </TableCell>
      <TableCell className="text-sm font-medium text-foreground">
        {formatPriceRange(service.priceFrom, service.priceTo)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {service.turnaround}
      </TableCell>
      <TableCell className="text-center">
        {service.popular ? (
          <Star className="mx-auto size-4 fill-amber-400 text-amber-400" />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <ActiveToggle service={service} />
      </TableCell>
      <TableCell className="pr-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit(service)}
            aria-label={`Edit ${service.name}`}
          >
            <Pencil className="size-4" />
          </Button>
          <DeleteServiceButton service={service} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function ActiveToggle({ service }: { service: Service }) {
  const updateMutation = useUpdateService(service.id);
  return (
    <div className="flex justify-center">
      <Switch
        checked={service.active}
        disabled={updateMutation.isPending}
        onCheckedChange={(v) => updateMutation.mutate({ active: v })}
        aria-label={`Toggle active for ${service.name}`}
      />
    </div>
  );
}

function DeleteServiceButton({ service }: { service: Service }) {
  const deleteMutation = useDeleteService();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${service.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this service?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{service.name}</strong> will be permanently removed from your
            catalog. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(service.id)}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete service"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ServicesCMS;
