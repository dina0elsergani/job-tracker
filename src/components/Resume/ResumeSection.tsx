
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ResumeSection = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setResumeFile(file);
        toast({
          title: "Resume uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const generateMockAnalysis = () => {
    const analyses = [
      `**Resume Analysis Summary**

**Strengths:**
✅ Strong technical skills section with relevant technologies
✅ Clear work experience with quantifiable achievements
✅ Good use of action verbs and specific metrics
✅ Clean, professional formatting

**Areas for Improvement:**
⚠️ Consider adding more keywords related to your target role
⚠️ Include a brief professional summary at the top
⚠️ Add more specific project outcomes and impact metrics
⚠️ Consider reorganizing sections for better flow

**Recommendations:**
🎯 Tailor your resume for each application
🎯 Use industry-specific keywords from job descriptions
🎯 Quantify achievements with numbers and percentages
🎯 Keep it to 1-2 pages maximum

**ATS Compatibility Score: 85/100**
Your resume should pass most Applicant Tracking Systems, but consider optimizing keyword density for better matching.`,

      `**AI-Powered Resume Review**

**Overall Score: B+ (87/100)**

**What's Working Well:**
✅ Professional experience clearly demonstrates growth
✅ Skills section aligns with current market demands  
✅ Education and certifications are relevant
✅ Contact information is complete and professional

**Critical Improvements Needed:**
🔧 Add a compelling professional summary (2-3 lines)
🔧 Include more metrics and quantifiable results
🔧 Optimize for ATS with better keyword integration
🔧 Consider adding relevant project portfolio links

**Industry-Specific Feedback:**
🎯 For tech roles: Emphasize problem-solving and collaboration
🎯 Include specific technologies used in each role
🎯 Mention agile/scrum experience if applicable
🎯 Add GitHub or portfolio links

**Next Steps:**
1. Rewrite your summary section
2. Add 2-3 more quantified achievements
3. Research keywords from target job postings
4. Update with recent technologies/frameworks`,
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis();
      setAiAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyze with AI-powered insights.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Resume Upload
          </CardTitle>
          <CardDescription>
            Upload your resume to get AI-powered feedback and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center space-y-2">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Upload your resume</p>
                  <p className="text-xs text-muted-foreground">
                    PDF files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>

            {resumeFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{resumeFile.name}</span>
                  <Badge variant="secondary">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
                <Button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {(aiAnalysis || isAnalyzing) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Analysis Results
              {hasAnalyzed && <Badge variant="secondary">Latest</Badge>}
            </CardTitle>
            <CardDescription>
              AI-powered insights and recommendations for your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing your resume...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded">
                    <div className="h-2 bg-primary rounded animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Checking formatting, keywords, and content structure...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={aiAnalysis}
                  onChange={(e) => setAiAnalysis(e.target.value)}
                  placeholder="AI analysis will appear here..."
                  className="min-h-[400px] font-mono text-sm"
                  readOnly
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAnalyzeResume}
                    disabled={!resumeFile}
                  >
                    Re-analyze
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resume Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Best Practices
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use action verbs (achieved, implemented, optimized)</li>
                <li>• Include quantifiable results and metrics</li>
                <li>• Tailor keywords for each application</li>
                <li>• Keep formatting clean and ATS-friendly</li>
                <li>• Update regularly with new skills and experiences</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Common Mistakes
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Generic objective statements</li>
                <li>• Missing contact information</li>
                <li>• Inconsistent formatting</li>
                <li>• Too many pages (keep to 1-2)</li>
                <li>• Typos and grammatical errors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeSection;
