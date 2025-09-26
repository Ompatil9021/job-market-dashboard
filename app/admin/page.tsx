"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Database, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const handleDatasetUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setUploading(true)
    setUploadResult(null)

    try {
      console.log("[v0] Starting dataset upload...")
      const response = await fetch("/api/upload-dataset", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("[v0] Upload result:", result)
      setUploadResult(result)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadResult({ error: "Upload failed" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Upload and manage your job market dataset</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Dataset Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Dataset</span>
              </CardTitle>
              <CardDescription>
                Upload your job market dataset in CSV or JSON format to replace the mock data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDatasetUpload} className="space-y-4">
                <div>
                  <Label htmlFor="dataset">Dataset File</Label>
                  <Input id="dataset" name="dataset" type="file" accept=".csv,.json" required className="mt-1" />
                  <p className="text-sm text-muted-foreground mt-1">Supported formats: CSV, JSON</p>
                </div>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Database className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Dataset
                    </>
                  )}
                </Button>
              </form>

              {uploadResult && (
                <div className="mt-6 p-4 border rounded-lg">
                  {uploadResult.success ? (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium text-success">Upload Successful!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Processed {uploadResult.recordCount} records
                        </p>
                        {uploadResult.columns && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Detected columns:</p>
                            <p className="text-sm text-muted-foreground">{uploadResult.columns.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Upload Failed</p>
                        <p className="text-sm text-muted-foreground mt-1">{uploadResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Data Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Current Data Status</span>
              </CardTitle>
              <CardDescription>Overview of the current dataset being used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">Mock Data</div>
                  <div className="text-sm text-muted-foreground">Current Source</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">~50</div>
                  <div className="text-sm text-muted-foreground">Skills Tracked</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Industries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
