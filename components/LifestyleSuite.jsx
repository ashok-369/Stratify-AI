
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { Modal } from './Modal.jsx';
import { 
    WeddingInviter, 
    BirthdayMaker, 
    PhotoAlbum, 
    MealPlanner, 
    FitnessPlanner, 
    RelationshipCoach, 
    ParentingTools 
} from './LifestyleTools.jsx';

const TOOLS = [
    { id: 'wedding', title: 'Wedding Invitations', description: 'Design elegant invites instantly.', icon: 'heart', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'birthday', title: 'Birthday Flyers', description: 'Fun templates for any age.', icon: 'gift', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'album', title: 'Digital Album', description: 'Organize memories beautifully.', icon: 'camera-icon', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'meal', title: 'Meal Planner', description: 'Healthy eating made simple.', icon: 'utensils', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'fitness', title: 'Fitness Routine', description: 'Workouts that fit your life.', icon: 'dumbbell', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'relationship', title: 'Relationship Guide', description: 'Advice for stronger bonds.', icon: 'smile', color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'parenting', title: 'Parenting Helpers', description: 'Charts for happy homes.', icon: 'baby', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

export const LifestyleSuite = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id)