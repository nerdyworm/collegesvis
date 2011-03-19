require 'json'

# This script takes a csv file and
# converts it to a JSON format
#
# The script expects the first line 
# of the file to be the field names.
# These names will be used as the key
# for each of the values in the json
# data.
#
# Outputs the JSON encoded data to STDIO
#
# Usage: ruby csv_to_json.rb file.csv > file.json
# Requires: Ruby and JSON gem pacakge


file = File.new(ARGV[0])
field_names = file.gets.split(",")

field_names = field_names.collect do |name|
  name.downcase.gsub(/ /, "_");
end

json = []

while(line = file.gets) do
  data = line.split(",")
  h = {}
  field_names.each_with_index do |n, i|
    h[n] = data[i]
  end
  json << h
end

puts json.to_json
