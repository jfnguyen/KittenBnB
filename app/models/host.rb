class Host < ActiveRecord::Base
  validates :fname, presence: true
  validates :portrait_path, presence: true
end
