'use client'

import { CheckCircle as LucideCheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function CertificatePage() {
  const { theme } = useTheme()
  const [name, setName] = useState("")
  const [showCertificate, setShowCertificate] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    if (name.trim()) {
      setShowCertificate(true)
    }
  }

  const handleDownloadPdf = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable CORS if images are from external sources
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'mm' for millimeters, 'a4' size
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate height to maintain aspect ratio

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${name.replace(/ /g, '_')}_certificate.pdf`);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {!showCertificate ? (
        <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg bg-card border border-border">
          <div className="text-center">
            <LucideCheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Generate Your Certificate
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your name to generate a certificate of completion
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleGenerate} className="w-full">
              Generate Certificate
            </Button>
          </div>
        </div>
      ) : (
        <div ref={certificateRef} className="w-full max-w-3xl p-10 rounded-xl shadow-lg bg-card border border-border text-center">
          <div className="border-2 border-primary p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-primary mb-4">Certificate of Completion</h1>
            <p className="text-lg mb-8">This certifies that</p>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-4">{name}</h2>
            <p className="text-lg mb-8">has successfully completed all missions in the Digital Defenders program</p>
            <div className="flex justify-between mt-12">
              <div className="text-left">
                <p className="font-bold">Date:</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Digital Defenders</p>
                <p>Training Program</p>
              </div>
            </div>
          </div>
          <Button onClick={handleDownloadPdf} className="w-full mt-8">
            Download Certificate
          </Button>
          <Button asChild className="w-full mt-2">
            <Link href="/">Return to Mission Control</Link>
          </Button>
        </div>
      )}
    </div>
  )
}