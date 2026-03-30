<template>
  <div class="max-w-3xl space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="outline" class="px-3" @click="router.push('/dashboard/publications')">
        <PhArrowLeft class="h-4 w-4" />
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Edit Karya Ilmiah</h1>
        <p class="text-gray-500 mt-1">Ubah informasi dokumen yang sudah ada.</p>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <template v-if="fetching">
      <Card>
        <CardContent class="p-6 space-y-6">
          <Skeleton class="h-8 w-[200px]" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
          </div>
          <Skeleton class="h-32 w-full" />
        </CardContent>
      </Card>
    </template>

    <template v-else>
      <Card>
        <CardHeader>
          <CardTitle>Metadata Dokumen</CardTitle>
          <CardDescription>Ubah detail mengenai karya ilmiah</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="requestSubmit" class="space-y-6">
            
            <div class="space-y-4">
              <div class="grid gap-2">
                <Label for="title">Judul Karya Ilmiah <span class="text-red-500">*</span></Label>
                <Input id="title" name="title" v-model="formData.title" required placeholder="Masukkan judul lengkap" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="authorName">Nama Penulis <span class="text-red-500">*</span></Label>
                  <Input id="authorName" name="authorName" v-model="formData.authorName" required />
                </div>
                <div class="grid gap-2">
                  <Label for="authorAffiliation">Afiliasi/Institusi</Label>
                  <Input id="authorAffiliation" name="authorAffiliation" v-model="formData.authorAffiliation" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="type">Jenis Karya <span class="text-red-500">*</span></Label>
                  <Select v-model="formData.type" required>
                    <option value="" disabled>Pilih Jenis Karya</option>
                    <option value="Skripsi">Skripsi</option>
                    <option value="Tesis">Tesis</option>
                    <option value="Jurnal">Jurnal</option>
                    <option value="Prosiding">Prosiding</option>
                    <option value="Laporan Penelitian">Laporan Penelitian</option>
                    <option value="Buku Ajar dosen">Buku Ajar Dosen</option>
                  </Select>
                </div>
                <div class="grid gap-2">
                  <Label for="year">Tahun Terbit <span class="text-red-500">*</span></Label>
                  <Input id="year" name="year" type="number" min="1900" :max="new Date().getFullYear()" v-model="formData.year" required />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="programStudy">Program Studi <span class="text-red-500">*</span></Label>
                  <Select v-model="formData.programStudy" required>
                    <option value="" disabled>Pilih Program Studi</option>
                    <option value="Ekonomi Syariah">Ekonomi Syariah</option>
                    <option value="Perbankan Syariah">Perbankan Syariah</option>
                    <option value="Manajemen Bisnis Syariah">Manajemen Bisnis Syariah</option>
                    <option value="Lainnya">Lainnya</option>
                  </Select>
                </div>
                <div class="grid gap-2">
                  <Label for="keywords">Kata Kunci</Label>
                  <Input id="keywords" name="keywords" v-model="formData.keywords" placeholder="Pisahkan dengan koma (contoh: zakat, inflasi, ekonomi)" />
                </div>
              </div>

              <div class="grid gap-2">
                <Label for="abstract">Abstrak <span class="text-red-500">*</span></Label>
                <Textarea id="abstract" name="abstract" v-model="formData.abstract" required rows="6" placeholder="Tuliskan abstrak karya ilmiah..." />
              </div>

              <div class="grid gap-2 p-4 border rounded-md bg-gray-50/50">
                <Label for="file" class="text-base flex items-center gap-2">
                  <PhUploadSimple class="h-4 w-4" /> Ganti File PDF
                </Label>
                <p class="text-xs text-gray-500 mb-2">Opsional, tinggalkan kosong jika tidak ingin mengubah dokumen file asli.</p>
                <input id="file" type="file" accept="application/pdf" @change="handleFileChange" class="bg-white border border-gray-300 rounded-md p-2 text-sm cursor-pointer" />
              </div>
            </div>

            <div class="flex justify-end gap-4 border-t pt-4">
              <Button type="button" variant="outline" @click="router.push('/dashboard/publications')">
                Batal
              </Button>
              <Button type="submit" :disabled="loading">
                {{ loading ? "Menyimpan..." : "Simpan Perubahan" }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </template>

    <!-- Modal Konfirmasi Edit -->
    <div v-if="alertOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in-up">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900">Konfirmasi</h2>
          <p class="text-gray-500 mt-2">
            Apakah Anda yakin ingin menyimpan perubahan pada karya ilmiah ini?
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="outline" @click="alertOpen = false">Batal</Button>
          <Button variant="default" @click="handleSubmit" :loading="loading">Ya, Simpan</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/axios'
import { PhArrowLeft, PhUploadSimple } from '@phosphor-icons/vue'
import { useToast } from '../../composables/useToast'

import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import CardTitle from '../../components/ui/CardTitle.vue'
import CardDescription from '../../components/ui/CardDescription.vue'
import CardContent from '../../components/ui/CardContent.vue'
import Input from '../../components/ui/Input.vue'
import Label from '../../components/ui/Label.vue'
import Select from '../../components/ui/Select.vue'
import Textarea from '../../components/ui/Textarea.vue'
import Button from '../../components/ui/Button.vue'
import Skeleton from '../../components/ui/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const pubId = route.params.id as string

const fetching = ref(true)
const loading = ref(false)
const file = ref<File | null>(null)
const alertOpen = ref(false)

const formData = ref({
  title: "",
  authorName: "",
  authorAffiliation: "",
  abstract: "",
  year: "",
  programStudy: "",
  type: "",
  keywords: "",
})

onMounted(async () => {
  try {
    const response = await api.get('/publications?dashboard=true')
    const publications = response.data.publications || response.data || []
    const pub = publications.find((p: any) => p.id === pubId)
    
    if (pub) {
      formData.value = {
        title: pub.title || "",
        authorName: pub.author?.name || "",
        authorAffiliation: pub.author?.affiliation || "",
        abstract: pub.abstract || "",
        year: pub.year?.toString() || "",
        programStudy: pub.programStudy || "",
        type: pub.type || "",
        keywords: pub.keywords?.map((k: any) => k.keyword?.name).join(", ") || "",
      }
    } else {
      toast.error("Data tidak ditemukan")
      router.push("/dashboard/publications")
    }
  } catch (error) {
    console.error(error)
    toast.error("Gagal mengambil data publikasi")
  } finally {
    fetching.value = false
  }
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan.")
      file.value = null
      target.value = ''
    } else {
      file.value = selectedFile
    }
  }
}

const requestSubmit = () => {
  if (!formData.value.type || !formData.value.programStudy) {
    toast.warning("Data tidak lengkap: Pilih Jenis Karya dan Program Studi.")
    return
  }
  alertOpen.value = true
}

const handleSubmit = async () => {
  alertOpen.value = false
  loading.value = true

  try {
    let pdfUrl = null

    // Upload file if exists
    if (file.value) {
      const fileData = new FormData()
      fileData.append("file", file.value)

      const uploadRes = await api.post("/upload", fileData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      pdfUrl = uploadRes.data.fileUrl || uploadRes.data.url
    }

    // Update Publication Record
    const payload = {
      ...formData.value,
      ...(pdfUrl ? { pdfUrl } : {})
    }

    await api.put(`/publications/${pubId}`, payload)

    toast.success("Karya ilmiah berhasil diubah.")
    router.push("/dashboard/publications")

  } catch (error: any) {
    console.error(error)
    toast.error(error.response?.data?.message || "Gagal mengupdate data publikasi")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
