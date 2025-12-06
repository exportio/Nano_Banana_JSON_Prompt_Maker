export interface PrimaryLight {
  type: string;
  direction: string;
  intensity: string;
}

export interface LightingSetup {
  primary_light: PrimaryLight;
  shadows: string;
  color_temperature: string;
  special_effects: string;
}

export interface TextElement {
  text_content: string;
  position: string;
  font_style: string;
  size: string;
  color: string;
  effects: string;
  language: string;
}

export interface ReferenceImage {
  image_id: number;
  purpose: 'style reference' | 'composition reference' | 'color reference' | 'character reference' | string;
  extract_elements: string[];
  apply_to: string;
  transfer_intensity: string;
}

export interface Character {
  character_id: number;
  detailed_description: string;
  clothing: string;
  pose: string;
  position_in_scene: string;
  consistency_reference: string;
}

export interface Grounding {
  enabled: boolean;
  search_queries: string[];
  data_requirements: string[];
  accuracy_priority: 'high' | 'medium' | string;
}

export interface NanoBananaSchema {
  generation_mode: 'thinking' | 'standard';
  output_specifications: {
    resolution: '1K' | '2K' | '4K';
    aspect_ratio: '16:9' | '1:1' | '9:16' | 'custom';
    quality_priority: 'speed' | 'balanced' | 'quality';
  };
  scene_description: {
    primary_subject: string;
    environment: string;
    atmosphere: string;
    style: string;
    time_of_day: string;
  };
  camera_controls: {
    angle: string;
    focal_length: string;
    depth_of_field: string;
    composition: string;
  };
  lighting_setup: LightingSetup;
  color_grading: {
    overall_tone: string;
    color_palette: string[];
    mood: string;
  };
  text_elements: TextElement[];
  reference_images: ReferenceImage[];
  characters: Character[];
  grounding: Grounding;
  style_constraints: {
    artistic_style: string;
    inspiration: string;
    must_avoid: string[];
  };
  technical_requirements: {
    intended_use: string;
    safe_zones: string;
    brand_guidelines: string[];
  };
  consistency_requirements: {
    maintain_across_series: boolean;
    locked_elements: string[];
    variable_elements: string[];
  };
}