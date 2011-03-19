require 'json'
require 'csv'

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


csv = CSV.read(ARGV[0])

field_names = csv.shift
field_names = field_names.collect do |name|
  name.strip.downcase.gsub(/ /, "_");
end

json = []

csv.each do |row|
  h = {}
  field_names.each_with_index do |n, i|
    h[n] = row[i]
  end
  json << h
end

puts json.to_json
