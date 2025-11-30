import React, { useState } from 'react';
import { Presentation as PresentationIcon, Download, Image as ImageIcon, ChevronRight, ChevronLeft, RefreshCw, Wand2, FileDown, HardDrive } from 'lucide-react';
import { Presentation, Slide } from '../types';
import { generateSlideContent, generateImageFromPrompt } from '../services/geminiService';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

export const SlideGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [generatingImages, setGeneratingImages] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setPresentation(null);
    setCurrentSlideIndex(0);
    setGeneratingImages({});

    try {
      const result = await generateSlideContent(topic);
      setPresentation(result);
    } catch (error) {
      alert("Erro ao gerar slides. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (slideIndex: number, prompt: string) => {
    if (generatingImages[slideIndex]) return;

    setGeneratingImages(prev => ({ ...prev, [slideIndex]: true }));
    try {
      const imageUrl = await generateImageFromPrompt(prompt);
      if (imageUrl && presentation) {
        const newSlides = [...presentation.slides];
        newSlides[slideIndex] = { ...newSlides[slideIndex], generatedImageBase64: imageUrl };
        setPresentation({ ...presentation, slides: newSlides });
      } else {
        alert("Não foi possível gerar a imagem no momento. Tente novamente.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingImages(prev => ({ ...prev, [slideIndex]: false }));
    }
  };

  const handleDownloadPDF = () => {
    if (!presentation) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Color Palette
    const primaryColor = [79, 70, 229]; // Indigo 600
    const textColor = [31, 41, 55]; // Gray 800

    presentation.slides.forEach((slide, index) => {
      if (index > 0) doc.addPage();

      // Background accent
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 297, 210, 'F');
      
      // Header Bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 297, 20, 'F');
      
      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(presentation.topic, 10, 13);
      doc.text(`Slide ${index + 1}/${presentation.slides.length}`, 280, 13, { align: 'right' });

      // Title
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(slide.title, 15, 40);

      // Subtitle
      if (slide.subtitle) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(slide.subtitle, 15, 50);
      }

      // Layout Logic: If image exists, split screen. If not, full width text.
      const hasImage = !!slide.generatedImageBase64;
      let textMaxWidth = 260;
      
      if (hasImage) {
        textMaxWidth = 130;
        try {
          // Add Image (Right side)
          // Omitting format allows jsPDF to detect from Data URI (PNG or JPEG)
          doc.addImage(slide.generatedImageBase64!, 'PNG', 150, 60, 130, 73); 
        } catch (e) {
          console.error("Error adding image to PDF", e);
        }
      }

      // Content (Bullet points)
      doc.setFontSize(14);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      let yPos = hasImage ? 60 : 70;
      
      slide.content.forEach((point) => {
        const splitText = doc.splitTextToSize(`• ${point}`, textMaxWidth);
        doc.text(splitText, 15, yPos);
        yPos += (splitText.length * 7) + 5;
      });

      // Footer - CREDITS REMOVED
      // doc.text("Gerado por Tutor Escolar IA", ...);
    });

    doc.save(`${presentation.topic.replace(/\s+/g, '_')}_presentation.pdf`);
  };

  const handleExportJSON = () => {
    if (!presentation) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presentation));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${presentation.topic.replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const nextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <PresentationIcon className="text-purple-600 dark:text-purple-400" size={36} />
            Criador de Slides IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Gere apresentações completas com imagens originais em segundos.</p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-white/10 mb-12 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Qual o tema da aula?</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Sistema Solar, Segunda Guerra Mundial, Fotossíntese..."
              className="flex-1 rounded-xl border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button onClick={handleGenerate} isLoading={isGenerating} variant="glow" className="py-4">
              <Wand2 size={18} className="mr-2" />
              Gerar Slides
            </Button>
          </div>
        </div>

        {/* Presentation Viewer */}
        {presentation && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {presentation.topic} <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md ml-2">{currentSlideIndex + 1} / {presentation.slides.length}</span>
              </h2>
              
              <div className="flex flex-wrap gap-2">
                 <Button onClick={handleDownloadPDF} variant="outline" className="text-sm py-2">
                    <FileDown size={18} className="mr-2" />
                    Baixar PDF
                 </Button>
                 <Button onClick={handleExportJSON} variant="secondary" className="text-sm py-2" title="Baixar arquivo JSON para backup">
                    <HardDrive size={18} className="mr-2" />
                    Salvar Dados (Drive)
                 </Button>
              </div>
            </div>

            {/* Slide Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 min-h-[600px] flex flex-col lg:flex-row relative">
               
               {/* Controls Overlay (Mobile optimized) */}
               <button 
                  onClick={prevSlide} 
                  disabled={currentSlideIndex === 0} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-0 transition-all text-white border border-white/20"
                >
                  <ChevronLeft size={24} />
               </button>
               <button 
                  onClick={nextSlide} 
                  disabled={currentSlideIndex === presentation.slides.length - 1} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-0 transition-all text-white border border-white/20"
                >
                  <ChevronRight size={24} />
               </button>

              {/* Left: Text Content */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
                <div className="mb-6">
                    <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-cyan-400 uppercase border border-indigo-200 dark:border-cyan-900 px-3 py-1 rounded-full">Slide {currentSlideIndex + 1}</span>
                </div>
                <h3 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">{presentation.slides[currentSlideIndex].title}</h3>
                {presentation.slides[currentSlideIndex].subtitle && (
                    <h4 className="text-xl text-indigo-600 dark:text-indigo-400 mb-8 font-medium">{presentation.slides[currentSlideIndex].subtitle}</h4>
                )}
                
                <div className="space-y-4">
                  {presentation.slides[currentSlideIndex].content.map((point, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="h-2 w-2 mt-2.5 rounded-full bg-purple-500 mr-4 flex-shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Image Area */}
              <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-black relative flex items-center justify-center overflow-hidden">
                {presentation.slides[currentSlideIndex].generatedImageBase64 ? (
                    <img 
                        src={presentation.slides[currentSlideIndex].generatedImageBase64} 
                        alt="AI Generated" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="p-10 text-center relative z-10">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ImageIcon size={32} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="mb-6 text-sm max-w-sm mx-auto text-gray-500 dark:text-gray-400 italic bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                            "{presentation.slides[currentSlideIndex].imagePrompt}"
                        </p>
                        <Button 
                            variant="glow" 
                            onClick={() => handleGenerateImage(currentSlideIndex, presentation.slides[currentSlideIndex].imagePrompt)}
                            isLoading={generatingImages[currentSlideIndex]}
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Gerar Imagem
                        </Button>
                    </div>
                )}
                {/* Background Grid Pattern for empty state */}
                {!presentation.slides[currentSlideIndex].generatedImageBase64 && (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                )}
                
              </div>
            </div>

            {/* Navigation Dots/Thumbnails */}
            <div className="mt-8 flex justify-center gap-3 overflow-x-auto pb-4">
                {presentation.slides.map((slide, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-3 rounded-full transition-all duration-300 ${currentSlideIndex === idx ? 'w-12 bg-indigo-600 dark:bg-cyan-400' : 'w-3 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600'}`}
                        title={slide.title}
                    />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};