import os
import geopandas as gpd

# Define the input directory where the .shp files are located
input_directory = 'D:\data\\'  # Replace with your directory path

# List all .shp files in the input directory
shp_files = [f for f in os.listdir(input_directory) if f.endswith('.shp')]
print(shp_files)
# Iterate through the .shp files and convert them to GeoJSON
for shp_file in shp_files:
    shp_path = os.path.join(input_directory, shp_file)
    # Load the shapefile
    gdf = gpd.read_file(shp_path)

    # Create a GeoJSON output file path by replacing the file extension
    geojson_path = os.path.splitext(shp_path)[0] + '.geojson'

    # Save as GeoJSON
    gdf.to_file(geojson_path, driver='GeoJSON')

    print(f"Converted {shp_file} to {geojson_path}")