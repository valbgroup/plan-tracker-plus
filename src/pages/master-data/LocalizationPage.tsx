import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_GEO_ZONES,
  MOCK_COUNTRIES,
  MOCK_REGIONS,
  MOCK_PROVINCES,
  MOCK_DISTRICTS,
  MOCK_CITIES,
} from '@/data/masterDataMock';
import type { GeoZone, Country, Region, Province, District, City } from '@/types/masterData.types';
import { Lock, MapPin } from 'lucide-react';

export default function LocalizationPage() {
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('');

  const handleEdit = (item: unknown, table: string) => {
    setEditItem(item as Record<string, unknown>);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleCreate = (table: string) => {
    setEditItem(null);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleSave = (data: Record<string, unknown>) => {
    console.log('Saving:', activeTable, data);
    setIsModalOpen(false);
    setEditItem(null);
  };

  const getCountryName = (id: string) => {
    return MOCK_COUNTRIES.find((c) => c.country_id === id)?.libelle_en || id;
  };

  const getRegionName = (id: string) => {
    return MOCK_REGIONS.find((r) => r.region_id === id)?.libelle || id;
  };

  const getProvinceName = (id: string) => {
    return MOCK_PROVINCES.find((p) => p.province_id === id)?.libelle || id;
  };

  const getDistrictName = (id: string) => {
    return MOCK_DISTRICTS.find((d) => d.district_id === id)?.libelle || id;
  };

  const getFormFields = () => {
    switch (activeTable) {
      case 'region':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'country_id',
            label: 'Country',
            type: 'select' as const,
            required: true,
            options: MOCK_COUNTRIES.map((c) => ({ value: c.country_id, label: c.libelle_en })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'province':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'country_id',
            label: 'Country',
            type: 'select' as const,
            required: true,
            options: MOCK_COUNTRIES.map((c) => ({ value: c.country_id, label: c.libelle_en })),
          },
          {
            key: 'region_id',
            label: 'Region',
            type: 'select' as const,
            options: MOCK_REGIONS.map((r) => ({ value: r.region_id, label: r.libelle })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'district':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'country_id',
            label: 'Country',
            type: 'select' as const,
            required: true,
            options: MOCK_COUNTRIES.map((c) => ({ value: c.country_id, label: c.libelle_en })),
          },
          {
            key: 'province_id',
            label: 'Province',
            type: 'select' as const,
            required: true,
            options: MOCK_PROVINCES.map((p) => ({ value: p.province_id, label: p.libelle })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'city':
        return [
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'country_id',
            label: 'Country',
            type: 'select' as const,
            required: true,
            options: MOCK_COUNTRIES.map((c) => ({ value: c.country_id, label: c.libelle_en })),
          },
          {
            key: 'province_id',
            label: 'Province',
            type: 'select' as const,
            required: true,
            options: MOCK_PROVINCES.map((p) => ({ value: p.province_id, label: p.libelle })),
          },
          {
            key: 'district_id',
            label: 'District',
            type: 'select' as const,
            required: true,
            options: MOCK_DISTRICTS.map((d) => ({ value: d.district_id, label: d.libelle })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Localization</h1>
          <p className="text-muted-foreground mt-1">
            Manage geographic zones, countries, regions, provinces, districts, and cities
          </p>
        </div>
      </div>

      <Tabs defaultValue="geo-zone" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 max-w-4xl">
          <TabsTrigger value="geo-zone">
            Geo Zone <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="country">
            Country <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
          <TabsTrigger value="province">Province</TabsTrigger>
          <TabsTrigger value="district">District</TabsTrigger>
          <TabsTrigger value="city">City</TabsTrigger>
        </TabsList>

        <TabsContent value="geo-zone">
          <MasterDataTable<GeoZone>
            data={MOCK_GEO_ZONES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              { key: 'description', label: 'Description' },
            ]}
            title="Geographic Zones"
            description="Major geographic regions (fixed)"
            isFrozen={true}
            idKey="geo_zone_id"
          />
        </TabsContent>

        <TabsContent value="country">
          <MasterDataTable<Country>
            data={MOCK_COUNTRIES}
            columns={[
              { key: 'code_iso2', label: 'ISO2' },
              { key: 'code_iso3', label: 'ISO3' },
              { key: 'libelle_en', label: 'Name (EN)' },
              { key: 'libelle_fr', label: 'Name (FR)' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Countries"
            description="Available countries (ISO 3166)"
            isFrozen={true}
            idKey="country_id"
          />
        </TabsContent>

        <TabsContent value="region">
          <MasterDataTable<Region>
            data={MOCK_REGIONS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              {
                key: 'country_id',
                label: 'Country',
                render: (value) => <Badge variant="outline">{getCountryName(String(value))}</Badge>,
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Regions"
            description="Geographic regions within countries"
            onEdit={(row) => handleEdit(row, 'region')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('region')}
            isFrozen={false}
            idKey="region_id"
          />
        </TabsContent>

        <TabsContent value="province">
          <MasterDataTable<Province>
            data={MOCK_PROVINCES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              {
                key: 'country_id',
                label: 'Country',
                render: (value) => <Badge variant="outline">{getCountryName(String(value))}</Badge>,
              },
              {
                key: 'region_id',
                label: 'Region',
                render: (value) => value ? <Badge variant="secondary">{getRegionName(String(value))}</Badge> : '-',
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Provinces"
            description="Administrative divisions"
            onEdit={(row) => handleEdit(row, 'province')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('province')}
            isFrozen={false}
            idKey="province_id"
          />
        </TabsContent>

        <TabsContent value="district">
          <MasterDataTable<District>
            data={MOCK_DISTRICTS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              {
                key: 'province_id',
                label: 'Province',
                render: (value) => <Badge variant="outline">{getProvinceName(String(value))}</Badge>,
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Districts"
            description="Local administrative areas"
            onEdit={(row) => handleEdit(row, 'district')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('district')}
            isFrozen={false}
            idKey="district_id"
          />
        </TabsContent>

        <TabsContent value="city">
          <MasterDataTable<City>
            data={MOCK_CITIES}
            columns={[
              { key: 'libelle', label: 'Name' },
              {
                key: 'district_id',
                label: 'District',
                render: (value) => <Badge variant="outline">{getDistrictName(String(value))}</Badge>,
              },
              {
                key: 'province_id',
                label: 'Province',
                render: (value) => <Badge variant="secondary">{getProvinceName(String(value))}</Badge>,
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Cities"
            description="Cities and municipalities"
            onEdit={(row) => handleEdit(row, 'city')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('city')}
            isFrozen={false}
            idKey="city_id"
          />
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editItem ? 'Edit Location' : 'Create Location'}
        fields={getFormFields()}
        initialData={editItem || undefined}
      />
    </div>
  );
}
