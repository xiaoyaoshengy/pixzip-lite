<script lang="ts">
	import Fieldset from './fieldset.svelte';
	import Slider from '../ui/slider.svelte';
	import Checkbox from '../ui/checkbox.svelte';
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import { Select } from '../ui/select';

	const items = [
		{ value: 'original', label: 'Original' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'png', label: 'PNG' },
		{ value: 'jpg', label: 'JPG' }
	];

	const spaceConfig = getSpaceConfig();

	const level = $derived(spaceConfig.formData?.level ?? 1);

	const keepEXIF = $derived(!!spaceConfig.formData?.keepExif);

	const format = $derived.by(() => {
		return spaceConfig.formData?.format ?? items[0].value;
	});
</script>

<Fieldset legend="压缩">
	<div class="flex items-center justify-between">
		<span class="font-medium">格式</span>
		<Select
			{items}
			value={[format]}
			onValueChange={({ value }) => {
				spaceConfig.update('format', value[0]);
			}}
		></Select>
	</div>

	<hr class="border-neutral-200 dark:border-neutral-100/10 mt-3 mb-2" />

	<div>
		<div class="flex items-center justify-between mb-2">
			<span class="font-medium">压缩等级</span>
			<span>{level}</span>
		</div>
		<Slider
			value={[level]}
			step={1}
			min={1}
			max={9}
			onValueChange={({ value }) => {
				spaceConfig.update('level', value[0]);
			}}
			class="py-1"
		/>
		<div class="text-xs flex items-center justify-between mt-2 text-neutral-600">
			<span>最高质量</span>
			<span>最低质量</span>
		</div>
	</div>

	<hr class="border-neutral-200 dark:border-neutral-100/10 my-3" />

	<Checkbox
		label="保持EXIF"
		checked={keepEXIF}
		onchange={(e) => {
			spaceConfig.update('keepExif', (e.target as HTMLInputElement).checked);
		}}
	/>
</Fieldset>
