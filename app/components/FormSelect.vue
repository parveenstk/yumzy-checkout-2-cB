<script setup lang="ts">
defineProps<{
    modelValue: string
    name: string
    error?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value
    emit('update:modelValue', value)
    emit('change', value)
}
</script>

<template>
    <div>
        <select :value="modelValue" :name="name" @change="onChange" :class="[
            'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
            error ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500'
        ]">
            <slot />
        </select>

        <p v-if="error" class="ml-2 mt-1 text-sm text-[#e6193c]">
            {{ error }}
        </p>
    </div>
</template>
