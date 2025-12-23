
import React, { useMemo } from 'react';
import { 
  Briefcase, FileText, MessageSquare, Linkedin, Handshake, ScrollText, DollarSign, Mail, Moon, Sun, X, Loader2, Download, Sparkles, ArrowRight, ArrowLeft, Copy, Check, Bold, Italic, Underline, Undo, Redo, Phone, MapPin, Layout, List, ChevronDown, ChevronUp, Lightbulb, Target, BookOpen, Globe, Github, Plus, Trash2, ExternalLink, Code, ThumbsUp, ThumbsDown, TrendingUp, XCircle, CheckCircle, Shield, Scale, Clock, Users, Lock, Home, Wand2, User, GraduationCap, Award, PieChart, PenTool, Gavel, Megaphone, FileSpreadsheet, Box, LineChart, Zap, BarChart2, AlertTriangle, Presentation, Calculator, Table, Palette, Type, Image as ImageIcon, Layers, Book, ClipboardList, Brain, HelpCircle, FileCheck, Upload, FileUp, Camera, Video, Film, Youtube, Instagram, Calendar, LayoutTemplate, ShieldCheck, Receipt, Landmark, CreditCard, Activity,
  Terminal, Cpu, Smartphone, Database, Scissors, Wrench, Command, Grid,
  Heart, Utensils, Dumbbell, Baby, Music, Gift, Camera as CameraIcon, Smile, SunMedium
} from 'lucide-react';

export const Icon = ({ name, className = "", size = 24 }) => {
  const icons = useMemo(() => ({
    'briefcase': Briefcase, 'file-text': FileText, 'message-square': MessageSquare, 'linkedin': Linkedin, 'handshake': Handshake, 'scroll-text': ScrollText, 'dollar-sign': DollarSign, 'mail': Mail, 'moon': Moon, 'sun': Sun, 'x': X, 'loader': Loader2, 'download': Download, 'sparkles': Sparkles, 'arrow-right': ArrowRight, 'arrow-left': ArrowLeft, 'copy': Copy, 'check': Check, 'bold': Bold, 'italic': Italic, 'underline': Underline, 'undo': Undo, 'redo': Redo, 'phone': Phone, 'map-pin': MapPin, 'layout': Layout, 'list': List, 'chevron-down': ChevronDown, 'chevron-up': ChevronUp, 'lightbulb': Lightbulb, 'target': Target, 'book-open': BookOpen, 'globe': Globe, 'github': Github, 'plus': Plus, 'trash': Trash2, 'external-link': ExternalLink, 'code': Code, 'thumbs-up': ThumbsUp, 'thumbs-down': ThumbsDown, 'trending-up': TrendingUp, 'x-circle': XCircle, 'check-circle': CheckCircle, 'shield': Shield, 'scale': Scale, 'clock': Clock, 'users': Users, 'lock': Lock, 'home': Home, 'wand': Wand2, 'user': User, 'graduation-cap': GraduationCap, 'award': Award, 
    'pie-chart': PieChart, 'pen-tool': PenTool, 'gavel': Gavel, 'megaphone': Megaphone, 'file-spreadsheet': FileSpreadsheet, 'box': Box, 'line-chart': LineChart, 'zap': Zap, 'bar-chart-2': BarChart2, 'alert-triangle': AlertTriangle, 'presentation': Presentation, 'calculator': Calculator, 'table': Table, 'palette': Palette, 'type': Type, 'image': ImageIcon, 'layers': Layers, 'book': Book, 'clipboard-list': ClipboardList, 'brain': Brain, 'help-circle': HelpCircle, 'file-check': FileCheck, 'upload': Upload, 'file-up': FileUp,
    'camera': Camera, 'video': Video, 'film': Film, 'youtube': Youtube, 'instagram': Instagram, 'calendar': Calendar, 'layout-template': LayoutTemplate,
    'shield-check': ShieldCheck, 'receipt': Receipt, 'landmark': Landmark, 'credit-card': CreditCard, 'activity': Activity,
    'terminal': Terminal, 'cpu': Cpu, 'smartphone': Smartphone, 'database': Database, 'scissors': Scissors, 'wrench': Wrench, 'command': Command, 'grid': Grid,
    'heart': Heart, 'utensils': Utensils, 'dumbbell': Dumbbell, 'baby': Baby, 'music': Music, 'gift': Gift, 'camera-icon': CameraIcon, 'smile': Smile, 'sun-medium': SunMedium
  }), []);

  const IconComponent = icons[name] || icons['sparkles'];
  return <IconComponent className={className} size={size} />;
};
