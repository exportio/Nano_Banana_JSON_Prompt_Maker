import React, { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Wand2, Menu, X as XIcon } from 'lucide-react';
import bananaLogo from './banana1sm.png';
import {
  TextInput,
  SelectInput,
  Checkbox,
  Section,
  StringArrayInput,
  ComplexArrayInput
} from './components/ui';
import {
  NanoBananaSchema,
  Character,
  ReferenceImage,
  TextElement,
  Grounding,
  LightingSetup
} from './types';
import { INITIAL_FORM_STATE } from './constants';

const App = () => {
  const [formData, setFormData] = useState<NanoBananaSchema>(INITIAL_FORM_STATE);
  const [copied, setCopied] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // --- Handlers ---

  const updateField = useCallback(<K extends keyof NanoBananaSchema>(key: K, value: NanoBananaSchema[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedField = useCallback((parent: keyof NanoBananaSchema, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [key]: value
      }
    }));
  }, []);

  const updateLighting = (key: keyof LightingSetup | 'primary_light_field', value: any, subField?: keyof LightingSetup['primary_light']) => {
    setFormData(prev => {
      if (key === 'primary_light_field') {
        if (subField) {
          return {
            ...prev,
            lighting_setup: {
              ...prev.lighting_setup,
              primary_light: {
                ...prev.lighting_setup.primary_light,
                [subField]: value
              }
            }
          };
        }
        return prev;
      }

      return {
        ...prev,
        lighting_setup: {
          ...prev.lighting_setup,
          [key]: value
        }
      };
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setFormData(INITIAL_FORM_STATE);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white/80 backdrop-blur-md z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-br from-lime-400 to-green-500 w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-bold shadow-lg">N</span>
          <h1 className="font-bold text-lg text-slate-900">Nano Banana</h1>
        </div>
        <button
          onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          className="text-slate-500 p-2 hover:bg-slate-100 rounded-md"
        >
          {showPreviewMobile ? <XIcon size={24} /> : <Wand2 size={24} />}
        </button>
      </div>

      {/* LEFT PANEL: FORM SCROLLABLE */}
      <div className={`flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto bg-transparent transition-all ${showPreviewMobile ? 'hidden' : 'block'}`}>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center p-6 border-b border-transparent sticky top-0 z-10">
          <img src={bananaLogo} alt="Nano Banana" className="w-8 h-10 rounded-xl shadow-lg mr-3" />
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-lime-600 via-green-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-sm">
            Nano Banana Prompt Generator
          </h1>
          <div className="ml-auto">
            <button onClick={handleReset} className="flex items-center text-xs text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-white/50 transition-colors font-medium">
              <RefreshCw size={12} className="mr-1.5" /> Reset
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto pb-20 px-6">

          {/* 1. General Settings */}
          <Section title="General & Output" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                label="Generation Mode"
                value={formData.generation_mode}
                onChange={(e) => updateField('generation_mode', e.target.value as any)}
                options={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'thinking', label: 'Thinking (Reasoning)' }
                ]}
              />
              <SelectInput
                label="Resolution"
                value={formData.output_specifications.resolution}
                onChange={(e) => updateNestedField('output_specifications', 'resolution', e.target.value)}
                options={[
                  { value: '1K', label: '1K (Standard)' },
                  { value: '2K', label: '2K (High)' },
                  { value: '4K', label: '4K (Ultra)' }
                ]}
              />
              <SelectInput
                label="Aspect Ratio"
                value={formData.output_specifications.aspect_ratio}
                onChange={(e) => updateNestedField('output_specifications', 'aspect_ratio', e.target.value)}
                options={[
                  { value: '1:1', label: '1:1 (Square)' },
                  { value: '16:9', label: '16:9 (Landscape)' },
                  { value: '9:16', label: '9:16 (Portrait)' },
                  { value: 'custom', label: 'Custom' }
                ]}
              />
              <SelectInput
                label="Quality Priority"
                value={formData.output_specifications.quality_priority}
                onChange={(e) => updateNestedField('output_specifications', 'quality_priority', e.target.value)}
                options={[
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'speed', label: 'Speed' },
                  { value: 'quality', label: 'Quality' }
                ]}
              />
            </div>
          </Section>

          {/* 2. Scene Description */}
          <Section title="Scene Description" defaultOpen={true}>
            <TextInput
              label="Primary Subject"
              placeholder="e.g. A futuristic robot playing chess"
              value={formData.scene_description.primary_subject}
              onChange={(e) => updateNestedField('scene_description', 'primary_subject', e.target.value)}
            />
            <TextInput
              label="Environment"
              placeholder="e.g. A neon-lit rainy alleyway in Tokyo"
              value={formData.scene_description.environment}
              onChange={(e) => updateNestedField('scene_description', 'environment', e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Atmosphere"
                placeholder="e.g. Mysterious, melancholic"
                value={formData.scene_description.atmosphere}
                onChange={(e) => updateNestedField('scene_description', 'atmosphere', e.target.value)}
              />
              <TextInput
                label="Style"
                placeholder="e.g. Cyberpunk, Noir"
                value={formData.scene_description.style}
                onChange={(e) => updateNestedField('scene_description', 'style', e.target.value)}
              />
              <TextInput
                label="Time of Day"
                placeholder="e.g. Midnight, Golden Hour"
                value={formData.scene_description.time_of_day}
                onChange={(e) => updateNestedField('scene_description', 'time_of_day', e.target.value)}
              />
            </div>
          </Section>

          {/* 3. Camera & Tech */}
          <Section title="Camera Controls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Camera Angle"
                placeholder="e.g. Low angle, Bird's eye"
                value={formData.camera_controls.angle}
                onChange={(e) => updateNestedField('camera_controls', 'angle', e.target.value)}
              />
              <TextInput
                label="Focal Length"
                placeholder="e.g. 35mm, Wide-angle, Telephoto"
                value={formData.camera_controls.focal_length}
                onChange={(e) => updateNestedField('camera_controls', 'focal_length', e.target.value)}
              />
              <TextInput
                label="Depth of Field"
                placeholder="e.g. Shallow depth of field, Bokeh"
                value={formData.camera_controls.depth_of_field}
                onChange={(e) => updateNestedField('camera_controls', 'depth_of_field', e.target.value)}
              />
              <TextInput
                label="Composition"
                placeholder="e.g. Rule of thirds, Centered"
                value={formData.camera_controls.composition}
                onChange={(e) => updateNestedField('camera_controls', 'composition', e.target.value)}
              />
            </div>
          </Section>

          {/* 4. Lighting */}
          <Section title="Lighting Setup">
            <div className="p-4 border border-slate-200 rounded-2xl mb-4 bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Primary Light Source</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextInput
                  label="Type" placeholder="e.g. Softbox"
                  value={formData.lighting_setup.primary_light.type}
                  onChange={(e) => updateLighting('primary_light_field', e.target.value, 'type')}
                />
                <TextInput
                  label="Direction" placeholder="e.g. From left"
                  value={formData.lighting_setup.primary_light.direction}
                  onChange={(e) => updateLighting('primary_light_field', e.target.value, 'direction')}
                />
                <TextInput
                  label="Intensity" placeholder="e.g. High"
                  value={formData.lighting_setup.primary_light.intensity}
                  onChange={(e) => updateLighting('primary_light_field', e.target.value, 'intensity')}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Shadows" placeholder="e.g. Long dramatic shadows"
                value={formData.lighting_setup.shadows}
                onChange={(e) => updateLighting('shadows', e.target.value)}
              />
              <TextInput
                label="Color Temperature" placeholder="e.g. 5600K, Warm"
                value={formData.lighting_setup.color_temperature}
                onChange={(e) => updateLighting('color_temperature', e.target.value)}
              />
            </div>
            <TextInput
              label="Special Effects" placeholder="e.g. Volumetric fog, Lens flare"
              value={formData.lighting_setup.special_effects}
              onChange={(e) => updateLighting('special_effects', e.target.value)}
            />
          </Section>

          {/* 5. Color Grading */}
          <Section title="Color Grading">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextInput
                label="Overall Tone" placeholder="e.g. Cinematic, Muted"
                value={formData.color_grading.overall_tone}
                onChange={(e) => updateNestedField('color_grading', 'overall_tone', e.target.value)}
              />
              <TextInput
                label="Mood" placeholder="e.g. Nostalgic"
                value={formData.color_grading.mood}
                onChange={(e) => updateNestedField('color_grading', 'mood', e.target.value)}
              />
            </div>
            <StringArrayInput
              label="Color Palette"
              placeholder="e.g. #FF0000, Teal, Burnt Orange"
              values={formData.color_grading.color_palette}
              onChange={(newVal) => updateNestedField('color_grading', 'color_palette', newVal)}
            />
          </Section>

          {/* 6. Characters (Complex) */}
          <Section title="Characters">
            <ComplexArrayInput<Character>
              label="Characters in Scene"
              items={formData.characters}
              onAdd={() => setFormData(prev => ({
                ...prev,
                characters: [...prev.characters, {
                  character_id: prev.characters.length + 1,
                  detailed_description: '',
                  clothing: '',
                  pose: '',
                  position_in_scene: '',
                  consistency_reference: ''
                }]
              }))}
              onUpdate={(newItems) => updateField('characters', newItems)}
              renderItem={(char, idx, update) => (
                <div className="grid grid-cols-1 gap-3">
                  <div className="text-xs text-slate-500 uppercase font-bold">Character {char.character_id}</div>
                  <TextInput
                    label="Description" placeholder="Physical appearance..."
                    value={char.detailed_description}
                    onChange={(e) => update({ ...char, detailed_description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Clothing" placeholder="Outfit details..."
                      value={char.clothing}
                      onChange={(e) => update({ ...char, clothing: e.target.value })}
                    />
                    <TextInput
                      label="Pose" placeholder="Action/Posture..."
                      value={char.pose}
                      onChange={(e) => update({ ...char, pose: e.target.value })}
                    />
                  </div>
                  <TextInput
                    label="Position" placeholder="Where in scene..."
                    value={char.position_in_scene}
                    onChange={(e) => update({ ...char, position_in_scene: e.target.value })}
                  />
                </div>
              )}
            />
          </Section>

          {/* 7. Text Elements */}
          <Section title="Text Elements">
            <ComplexArrayInput<TextElement>
              label="Text Overlays"
              items={formData.text_elements}
              onAdd={() => setFormData(prev => ({
                ...prev,
                text_elements: [...prev.text_elements, {
                  text_content: '', position: '', font_style: '', size: '', color: '', effects: '', language: 'English'
                }]
              }))}
              onUpdate={(items) => updateField('text_elements', items)}
              renderItem={(text, idx, update) => (
                <div className="space-y-3">
                  <TextInput
                    label="Content" placeholder="Text to display..."
                    value={text.text_content}
                    onChange={(e) => update({ ...text, text_content: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Font Style" placeholder="e.g. Serif bold"
                      value={text.font_style}
                      onChange={(e) => update({ ...text, font_style: e.target.value })}
                    />
                    <TextInput
                      label="Position" placeholder="e.g. Center"
                      value={text.position}
                      onChange={(e) => update({ ...text, position: e.target.value })}
                    />
                    <TextInput
                      label="Color" placeholder="e.g. Gold"
                      value={text.color}
                      onChange={(e) => update({ ...text, color: e.target.value })}
                    />
                    <TextInput
                      label="Size" placeholder="e.g. Large"
                      value={text.size}
                      onChange={(e) => update({ ...text, size: e.target.value })}
                    />
                  </div>
                </div>
              )}
            />
          </Section>

          {/* 8. Reference Images */}
          <Section title="Reference Images">
            <ComplexArrayInput<ReferenceImage>
              label="References"
              items={formData.reference_images}
              onAdd={() => setFormData(prev => ({
                ...prev,
                reference_images: [...prev.reference_images, {
                  image_id: prev.reference_images.length + 1,
                  purpose: 'style reference',
                  extract_elements: [],
                  apply_to: '',
                  transfer_intensity: '100%'
                }]
              }))}
              onUpdate={(items) => updateField('reference_images', items)}
              renderItem={(ref, idx, update) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <SelectInput
                      label="Purpose"
                      value={ref.purpose}
                      onChange={(e) => update({ ...ref, purpose: e.target.value })}
                      options={[
                        { value: 'style reference', label: 'Style Reference' },
                        { value: 'composition reference', label: 'Composition Reference' },
                        { value: 'color reference', label: 'Color Reference' },
                        { value: 'character reference', label: 'Character Reference' }
                      ]}
                    />
                    <TextInput
                      label="Intensity" placeholder="0-100%"
                      value={ref.transfer_intensity}
                      onChange={(e) => update({ ...ref, transfer_intensity: e.target.value })}
                    />
                  </div>
                  <StringArrayInput
                    label="Elements to Extract"
                    values={ref.extract_elements}
                    onChange={(vals) => update({ ...ref, extract_elements: vals })}
                  />
                </div>
              )}
            />
          </Section>

          {/* 9. Grounding */}
          <Section title="Grounding (Facts)">
            <Checkbox
              label="Enable Grounding"
              checked={formData.grounding.enabled}
              onChange={(e) => updateNestedField('grounding', 'enabled', e.target.checked)}
            />
            {formData.grounding.enabled && (
              <div className="mt-4 pl-4 border-l-2 border-purple-500/50">
                <StringArrayInput
                  label="Search Queries"
                  values={formData.grounding.search_queries}
                  onChange={(vals) => updateNestedField('grounding', 'search_queries', vals)}
                />
                <SelectInput
                  label="Accuracy Priority"
                  value={formData.grounding.accuracy_priority}
                  onChange={(e) => updateNestedField('grounding', 'accuracy_priority', e.target.value)}
                  options={[
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' }
                  ]}
                />
              </div>
            )}
          </Section>

          {/* 10. Constraints & Tech */}
          <Section title="Requirements & Constraints">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Artistic Style" placeholder="e.g. 3D Render"
                value={formData.style_constraints.artistic_style}
                onChange={(e) => updateNestedField('style_constraints', 'artistic_style', e.target.value)}
              />
              <TextInput
                label="Intended Use" placeholder="e.g. Web Banner"
                value={formData.technical_requirements.intended_use}
                onChange={(e) => updateNestedField('technical_requirements', 'intended_use', e.target.value)}
              />
            </div>
            <StringArrayInput
              label="Must Avoid (Negative Prompt)"
              values={formData.style_constraints.must_avoid}
              onChange={(vals) => updateNestedField('style_constraints', 'must_avoid', vals)}
            />
            <div className="h-4"></div>
            <Checkbox
              label="Maintain Across Series"
              checked={formData.consistency_requirements.maintain_across_series}
              onChange={(e) => updateNestedField('consistency_requirements', 'maintain_across_series', e.target.checked)}
            />
            {formData.consistency_requirements.maintain_across_series && (
              <StringArrayInput
                label="Locked Elements"
                values={formData.consistency_requirements.locked_elements}
                onChange={(vals) => updateNestedField('consistency_requirements', 'locked_elements', vals)}
              />
            )}
          </Section>

        </div>
      </div>

      {/* RIGHT PANEL: JSON PREVIEW (Hidden on mobile unless toggled) */}
      <div className={`fixed inset-0 md:relative md:inset-auto md:w-[45%] lg:w-[40%] bg-slate-900 border-l border-slate-800 flex flex-col z-30 transition-transform duration-300 transform ${showPreviewMobile ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>

        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <h2 className="font-semibold text-slate-200">JSON Output</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${copied
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button
              onClick={() => setShowPreviewMobile(false)}
              className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-md"
            >
              <XIcon size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#0B1120]">
          <pre className="font-mono text-sm text-blue-300 whitespace-pre-wrap break-all leading-relaxed">
            {JSON.stringify(formData, (key, value) => {
              if (value === "") return undefined;
              if (Array.isArray(value) && value.length === 0) return undefined;
              return value;
            }, 2)}
          </pre>
        </div>
      </div>

    </div>
  );
};

export default App;