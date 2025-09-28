"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ImageIcon, Search } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type WisataItem = {
  id: string
  name: string
  category: string
  location: string
  photoUrl: string
  createdAt: string
}

const categories = ["Pantai", "Gunung", "Budaya", "Air Terjun", "Danau"] as const

const initialData: WisataItem[] = [
  {
    id: "w1",
    name: "Pantai Putih",
    category: "Pantai",
    location: "Kawasan Selatan",
    photoUrl: "/pantai-putih.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "w2",
    name: "Gunung Sejuk",
    category: "Gunung",
    location: "Pegunungan Timur",
    photoUrl: "/gunung-sejuk.jpg",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "w3",
    name: "Air Terjun Indah",
    category: "Air Terjun",
    location: "Hutan Utara",
    photoUrl: "/air-terjun-indah.jpg",
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
  },
  {
    id: "w4",
    name: "Kampung Adat",
    category: "Budaya",
    location: "Kota Tua",
    photoUrl: "/kampung-adat.jpg",
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
  },
  {
    id: "w5",
    name: "Danau Biru",
    category: "Danau",
    location: "Dataran Tinggi",
    photoUrl: "/danau-biru.jpg",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
]

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.enum(categories),
  location: z.string().min(2, "Location is required"),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

type SortKey = "name" | "createdAt"
type SortDir = "asc" | "desc"

function usePagedSortedFiltered(
  items: WisataItem[],
  q: string,
  cat: string,
  sortKey: SortKey,
  sortDir: SortDir,
  page: number,
  pageSize: number,
) {
  const filtered = items.filter((i) => {
    const matchesQ = i.name.toLowerCase().includes(q.toLowerCase())
    const matchesCat = cat === "All" || i.category === cat
    return matchesQ && matchesCat
  })
  const sorted = [...filtered].sort((a, b) => {
    let v = 0
    if (sortKey === "name") v = a.name.localeCompare(b.name)
    if (sortKey === "createdAt") v = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === "asc" ? v : -v
  })
  const start = page * pageSize
  const end = start + pageSize
  const pageItems = sorted.slice(start, end)
  return { pageItems, total: sorted.length }
}

export default function WisataPage() {
  const [items, setItems] = useState<WisataItem[]>(initialData)
  const [searchQ, setSearchQ] = useState("")
  const [category, setCategory] = useState<string>("All")
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(0)
  const pageSize = 5

  const { pageItems, total } = usePagedSortedFiltered(items, searchQ, category, sortKey, sortDir, page, pageSize)

  const pages = Math.max(1, Math.ceil(total / pageSize))

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function addItem(values: FormValues) {
    const id = `w_${Date.now().toString(36)}_${Math.round(Math.random() * 1e4)}`
    setItems((prev) => [
      {
        id,
        name: values.name,
        category: values.category,
        location: values.location,
        photoUrl: values.photoUrl && values.photoUrl.length > 0 ? values.photoUrl : "/wisata-photo.jpg",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setPage(0)
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Wisata</h1>
          <p className="text-sm text-muted-foreground">Manage tourism entries</p>
        </div>
        <AddDialog onAdd={addItem} />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Browse</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQ}
                  onChange={(e) => {
                    setSearchQ(e.target.value)
                    setPage(0)
                  }}
                  className="pl-8"
                />
              </div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v)
                  setPage(0)
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {total} total items • Page {page + 1} / {pages}
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                    Name {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                    Created {sortKey === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>
                      <ImageDialog thumbSrc={it.photoUrl} alt={it.name} />
                    </TableCell>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{it.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{it.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(it.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteButton onConfirm={() => deleteItem(it.id)} />
                    </TableCell>
                  </TableRow>
                ))}
                {pageItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      No items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {pageItems.length} of {total}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page + 1 >= pages}
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddDialog({ onAdd }: { onAdd: (v: FormValues) => void }) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", category: categories[0], location: "", photoUrl: "" },
  })

  function submit(values: FormValues) {
    onAdd(values)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> Add Wisata
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Wisata</DialogTitle>
          <DialogDescription>Fill out the form to add a new tourism entry.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Pantai Indah" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              defaultValue={categories[0]}
              onValueChange={(v) => {
                // sync into RHF manually
                const evt = { target: { name: "category", value: v } } as unknown as React.ChangeEvent<HTMLInputElement>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(register("category").onChange as any)(evt)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} placeholder="e.g., Kawasan Selatan" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" {...register("photoUrl")} placeholder="https://example.com/photo.jpg" />
            {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ImageDialog({ thumbSrc, alt }: { thumbSrc: string; alt: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative block size-12 overflow-hidden rounded-md ring-1 ring-border">
          <Image
            src={thumbSrc || "/placeholder.svg"}
            alt={alt}
            width={48}
            height={48}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white transition group-hover:bg-black/20">
            <ImageIcon className="size-4 opacity-0 group-hover:opacity-100" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={thumbSrc || "/placeholder.svg"} alt={alt} fill className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
