import { NanoBananaSchema } from './types';

export const INITIAL_FORM_STATE: NanoBananaSchema = {
  generation_mode: 'standard',
  output_specifications: {
    resolution: '1K',
    aspect_ratio: '1:1',
    quality_priority: 'balanced'
  },
  scene_description: {
    primary_subject: '',
    environment: '',
    atmosphere: '',
    style: '',
    time_of_day: ''
  },
  camera_controls: {
    angle: '',
    focal_length: '',
    depth_of_field: '',
    composition: ''
  },
  lighting_setup: {
    primary_light: {
      type: '',
      direction: '',
      intensity: ''
    },
    shadows: '',
    color_temperature: '',
    special_effects: ''
  },
  color_grading: {
    overall_tone: '',
    color_palette: [],
    mood: ''
  },
  text_elements: [],
  reference_images: [],
  characters: [],
  grounding: {
    enabled: false,
    search_queries: [],
    data_requirements: [],
    accuracy_priority: 'medium'
  },
  style_constraints: {
    artistic_style: '',
    inspiration: '',
    must_avoid: []
  },
  technical_requirements: {
    intended_use: '',
    safe_zones: '',
    brand_guidelines: []
  },
  consistency_requirements: {
    maintain_across_series: false,
    locked_elements: [],
    variable_elements: []
  }
};